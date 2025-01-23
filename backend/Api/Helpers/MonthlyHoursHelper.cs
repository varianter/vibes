using Api.Forecasts;
using Core.Extensions;
using Core.Organizations;
using Core.PlannedAbsences;
using Core.Staffings;
using Core.Weeks;

namespace Api.Helpers;

public static class MonthlyHoursHelper
{
	public static List<MonthlyHours> CalculateMonthlyWorkHoursBefore(DateOnly date, List<DateOnly> months, Organization organization)
	{
		var fromDate = months.Min().FirstWeekdayInMonth();

		return CalculateMonthlyWorkHours(fromDate, toDateExclusive: date, organization);
	}

	public static List<MonthlyHours> CalculateMonthlyWorkHoursAfter(DateOnly date, List<DateOnly> months, Organization organization)
	{
		var fromDate = date.AddDays(1);
		var toDateExclusive = months.Max().AddMonths(1).FirstDayInMonth();

		return CalculateMonthlyWorkHours(fromDate, toDateExclusive, organization);
	}

	public static double GetStaffedHoursForMonthInWeek(DateOnly month, Week week, List<Staffing> staffings, Organization organization)
	{
		var staffedHoursInWeek = staffings
			.Where(staffing => staffing.Week.Equals(week))
			.Sum(staffing => staffing.Hours);

		return GetHoursForMonthInWeek(month, week, staffedHoursInWeek, organization);
	}

	public static double GetPlannedAbsenceHoursForMonthInWeek(DateOnly month, Week week, List<PlannedAbsence> plannedAbsences, Organization organization)
	{
		var absenceHoursInWeek = plannedAbsences
			.Where(absence => absence.Week.Equals(week))
			.Sum(absence => absence.Hours);

		return GetHoursForMonthInWeek(month, week, absenceHoursInWeek, organization);
	}

	private static List<MonthlyHours> CalculateMonthlyWorkHours(DateOnly fromDate, DateOnly toDateExclusive, Organization organization)
	{
		if (fromDate >= toDateExclusive)
		{
			return [];
		}

		var months = fromDate.GetMonthsUntil(toDateExclusive).ToList();

		var toDateInclusive = toDateExclusive.AddDays(-1);

		return months
			.Select(month => GetWorkHoursForMonthInTimeSpan(month, fromDate, toDateInclusive, organization))
			.ToList();
	}

	private static MonthlyHours GetWorkHoursForMonthInTimeSpan(DateOnly month, DateOnly firstDayInTimeSpan, DateOnly lastDayInTimeSpan, Organization organization)
	{
		var workdays = month.WholeMonthIsIncludedInTimeSpan(firstDayInTimeSpan, lastDayInTimeSpan)
			? GetWorkdaysInMonth(month, organization)
			: GetWorkdaysInMonthWithinTimeSpan(month, firstDayInTimeSpan, lastDayInTimeSpan, organization);

		var workHours = organization.HoursPerWorkday * workdays;

		return new MonthlyHours(month, workHours);
	}

	private static double GetWorkdaysInMonth(DateOnly month, Organization organization)
	{
		var weekdayHolidaysInMonth = organization.GetHolidaysInMonth(month)
			.Count(DateOnlyExtensions.IsWeekday);

		return month.GetTotalWeekdaysInMonth() - weekdayHolidaysInMonth;
	}

	private static int GetWorkdaysInMonthWithinTimeSpan(DateOnly month, DateOnly firstDayInTimeSpan, DateOnly lastDayInTimeSpan, Organization organization)
	{
		var fromDate = DateOnlyExtensions.Max(month.FirstDayInMonth(), firstDayInTimeSpan);
		var toDateInclusive = DateOnlyExtensions.Min(month.LastDayInMonth(), lastDayInTimeSpan);

		var weekdays = month.GetWeekdaysInMonth()
			.CountDaysInTimeSpan(fromDate, toDateInclusive);

		var weekdayHolidays = organization.GetHolidaysInMonth(month)
			.Where(DateOnlyExtensions.IsWeekday)
			.CountDaysInTimeSpan(fromDate, toDateInclusive);

		return weekdays - weekdayHolidays;
	}

	private static double GetHoursForMonthInWeek(DateOnly month, Week week, double hoursInWeek, Organization organization)
	{
		if (hoursInWeek.IsEqualTo(0))
		{
			return 0;
		}

		if (WholeWorkWeekIsInMonth(month, week))
		{
			return hoursInWeek;
		}

		var availableWorkHours = GetAvailableWorkHours(month, week, organization);

		if (hoursInWeek.IsEqualTo(availableWorkHours.InWeek) ||
		    hoursInWeek.IsEqualTo(availableWorkHours.InWeekAndMonth))
		{
			return availableWorkHours.InWeekAndMonth;
		}

		// We are done trying to be smart: Making the assumption that the work hours are evenly distributed between each work day of the week
		return hoursInWeek * (availableWorkHours.InWeekAndMonth / availableWorkHours.InWeek);
	}

	private static bool WholeWorkWeekIsInMonth(DateOnly month, Week week)
	{
		return week.FirstDayOfWorkWeek().EqualsMonth(month) &&
		       week.LastWorkDayOfWeek().EqualsMonth(month);
	}

	private static (double InWeek, double InWeekAndMonth) GetAvailableWorkHours(DateOnly month, Week week, Organization organization)
	{
		var holidaysInWeek = organization.GetHolidaysInWeek(week);

		var workdaysInWeek = week.GetDatesInWorkWeek()
			.Where(date => !holidaysInWeek.Contains(date))
			.ToList();

		var workdaysInWeekAndMonth = workdaysInWeek
			.Count(workday => workday.EqualsMonth(month));

		var availableWorkHoursInWeekAndMonth = organization.HoursPerWorkday * workdaysInWeekAndMonth;
		var availableWorkHoursInWeek = organization.HoursPerWorkday * workdaysInWeek.Count;

		return (availableWorkHoursInWeek, availableWorkHoursInWeekAndMonth);
	}
}

using Api.Forecasts;
using Core.Consultants;
using Core.Extensions;
using Core.Organizations;
using Core.PlannedAbsences;
using Core.Staffings;
using Core.Weeks;

namespace Api.Helpers;

public static class MonthlyHoursHelper
{
	public static List<MonthlyHours> CalculateMonthlyWorkHoursBefore(DateOnly date, List<DateOnly> months, Consultant consultant)
	{
		// TODO Forecast
		throw new NotImplementedException();
	}

	public static List<MonthlyHours> CalculateMonthlyWorkHoursAfter(DateOnly date, List<DateOnly> months, Consultant consultant)
	{
		// TODO Forecast
		throw new NotImplementedException();
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

using Core.Consultants;
using Core.Extensions;
using Core.PlannedAbsences;
using Core.Staffings;
using Core.Weeks;

namespace Api.Helpers;

public static class MonthlyHoursHelper
{
	public static double GetStaffedHoursForMonthInWeek(DateOnly month, Week week, List<Staffing> staffings, Consultant consultant)
	{
		var staffedHoursInWeek = staffings
			.Where(staffing => staffing.Week.Equals(week))
			.Sum(staffing => staffing.Hours);

		return GetBookedHoursInWeekWithinMonth(month, week, staffedHoursInWeek, consultant);
	}

	public static double GetPlannedAbsenceHoursForMonthInWeek(DateOnly month, Week week, List<PlannedAbsence> plannedAbsences, Consultant consultant)
	{
		var absenceHoursInWeek = plannedAbsences
			.Where(absence => absence.Week.Equals(week))
			.Sum(absence => absence.Hours);

		return GetBookedHoursInWeekWithinMonth(month, week, absenceHoursInWeek, consultant);
	}

	private static double GetBookedHoursInWeekWithinMonth(DateOnly month, Week week, double bookedHoursInWeek, Consultant consultant)
	{
		if (bookedHoursInWeek.IsEqualTo(0))
		{
			return 0;
		}

		if (WholeWorkWeekIsInMonth(month, week))
		{
			return bookedHoursInWeek;
		}

		var bookableHours = GetBookableHours(month, week, consultant);

		if (bookedHoursInWeek.IsEqualTo(bookableHours.InWeek))
		{
			return bookableHours.InWeekWithinMonth;
		}

		var bookableHoursMatchForBothMonths = bookableHours.InWeekWithinMonth.IsEqualTo(bookableHours.InWeekWithinOtherMonth);

		if (bookableHoursMatchForBothMonths)
		{
			// TODO Forecast: Handle edge case where an odd-numbered amount of holidays occur within a week containing a month change, so that each month has an equal amount of work days in that week
			// Perhaps make a decision based on data from the previous and next week?
		}

		if (bookedHoursInWeek.IsEqualTo(bookableHours.InWeekWithinMonth))
		{
			return bookableHours.InWeekWithinMonth;
		}

		if (bookedHoursInWeek.IsEqualTo(bookableHours.InWeekWithinOtherMonth))
		{
			return 0;
		}

		// We are done trying to be smart: Making the assumption that the work hours are evenly distributed between each work day of the week
		return bookedHoursInWeek * (bookableHours.InWeekWithinMonth / bookableHours.InWeek);
	}

	private static bool WholeWorkWeekIsInMonth(DateOnly month, Week week)
	{
		return week.FirstDayOfWorkWeek().EqualsMonth(month) &&
			   week.LastWorkDayOfWeek().EqualsMonth(month);
	}

	private static (double InWeek, double InWeekWithinMonth, double InWeekWithinOtherMonth) GetBookableHours(DateOnly month, Week week, Consultant consultant)
	{
		var organization = consultant.Department.Organization;

		var holidaysInWeek = organization.GetHolidaysInWeek(week);

		var bookableDaysInWeek = week.GetDatesInWorkWeek()
			.Where(date => !holidaysInWeek.Contains(date))
			.Where(date => !consultant.Vacations.Any(vacation => vacation.Date.Equals(date)))
			.ToList();

		var bookableDaysInWeekWithinMonth = bookableDaysInWeek
			.Count(workday => workday.EqualsMonth(month));

		var bookableHoursInWeek = organization.HoursPerWorkday * bookableDaysInWeek.Count;
		var bookableHoursInWeekWithinMonth = organization.HoursPerWorkday * bookableDaysInWeekWithinMonth;

		var bookableHoursInWeekWithinOtherMonth = bookableHoursInWeek - bookableHoursInWeekWithinMonth;

		return (bookableHoursInWeek, bookableHoursInWeekWithinMonth, bookableHoursInWeekWithinOtherMonth);
	}
}

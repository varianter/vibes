using Api.Forecasts;
using Core.Extensions;
using Core.Months;
using Core.Organizations;

namespace Api.Helpers;

public static class WorkloadHelper
{
	public static List<MonthlyHours> CalculateMonthlyWorkHoursBefore(DateOnly date, List<Month> months, Organization organization)
	{
		if (months.Count == 0) return [];

		var fromDate = months.Min()!.FirstWeekday;
		var throughDate = date.AddDays(-1);

		return CalculateMonthlyWorkHours(fromDate, throughDate, organization);
	}

	public static List<MonthlyHours> CalculateMonthlyWorkHoursAfter(DateOnly date, List<Month> months, Organization organization)
	{
		if (months.Count == 0) return [];

		var fromDate = date.AddDays(1);
		var throughDate = months.Max()!.LastDay;

		return CalculateMonthlyWorkHours(fromDate, throughDate, organization);
	}

	private static List<MonthlyHours> CalculateMonthlyWorkHours(DateOnly fromDate, DateOnly throughDate, Organization organization)
	{
		if (fromDate > throughDate)
		{
			return [];
		}

		var months = fromDate.GetMonthsThrough(throughDate);

		return months
			.Select(month => CalculateWorkHoursForMonthInTimeSpan(month, fromDate, throughDate, organization))
			.ToList();
	}

	private static MonthlyHours CalculateWorkHoursForMonthInTimeSpan(Month month, DateOnly firstDayInTimeSpan, DateOnly lastDayInTimeSpan, Organization organization)
	{
		var workdays = month.WholeMonthIsIncludedInTimeSpan(firstDayInTimeSpan, lastDayInTimeSpan)
			? CalculateWorkdaysInMonth(month, organization)
			: CalculateWorkdaysInMonthWithinTimeSpan(month, firstDayInTimeSpan, lastDayInTimeSpan, organization);

		var workHours = organization.HoursPerWorkday * workdays;

		return new MonthlyHours(month, workHours);
	}

	private static double CalculateWorkdaysInMonth(Month month, Organization organization)
	{
		var weekdayHolidaysInMonth = organization.GetHolidaysInMonth(month)
			.Count(DateOnlyExtensions.IsWeekday);

		return month.CountWeekdays() - weekdayHolidaysInMonth;
	}

	private static int CalculateWorkdaysInMonthWithinTimeSpan(Month month, DateOnly firstDayInTimeSpan, DateOnly lastDayInTimeSpan, Organization organization)
	{
		var fromDate = DateOnlyExtensions.Max(month.FirstDay, firstDayInTimeSpan);
		var throughDate = DateOnlyExtensions.Min(month.LastDay, lastDayInTimeSpan);

		var weekdays = month.GetWeekdays()
			.CountDaysInTimeSpan(fromDate, throughDate);

		var weekdayHolidays = organization.GetHolidaysInMonth(month)
			.Where(DateOnlyExtensions.IsWeekday)
			.CountDaysInTimeSpan(fromDate, throughDate);

		return weekdays - weekdayHolidays;
	}
}

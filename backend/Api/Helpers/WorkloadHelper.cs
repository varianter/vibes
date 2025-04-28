using Api.Forecasts;
using Core.Extensions;
using Core.Months;
using Core.Organizations;

namespace Api.Helpers;

public static class WorkloadHelper
{
	public static List<MonthlyHours> CalculateMonthlyWorkHoursBefore(DateOnly date, List<Month> months, Organization organization)
	{
		var fromDate = months.Min().FirstWeekdayInMonth();

		return CalculateMonthlyWorkHours(fromDate, toDateExclusive: date, organization);
	}

	public static List<MonthlyHours> CalculateMonthlyWorkHoursAfter(DateOnly date, List<Month> months, Organization organization)
	{
		var fromDate = date.AddDays(1);
		var toDateExclusive = months.Max().AddMonths(1).FirstDayInMonth();

		return CalculateMonthlyWorkHours(fromDate, toDateExclusive, organization);
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
			.Select(month => CalculateWorkHoursForMonthInTimeSpan(month, fromDate, toDateInclusive, organization))
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

		return month.CountWeekdaysInMonth() - weekdayHolidaysInMonth;
	}

	private static int CalculateWorkdaysInMonthWithinTimeSpan(Month month, DateOnly firstDayInTimeSpan, DateOnly lastDayInTimeSpan, Organization organization)
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
}

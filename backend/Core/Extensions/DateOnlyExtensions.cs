using Core.Months;
using Core.Weeks;

namespace Core.Extensions;

public static class DateOnlyExtensions
{
	private static readonly int FirstMonthInQ1 = DateOnly.MinValue.Month;

	private static readonly List<int> QuarterlyMonths =
	[
		FirstMonthInQ1,
		FirstMonthInQ1 + 3,
		FirstMonthInQ1 + 6,
		FirstMonthInQ1 + 9,
	];

	public static bool IsWeekday(this DateOnly date) => date.DayOfWeek is >= DayOfWeek.Monday and <= DayOfWeek.Friday;

	public static Month FirstMonthInQuarter(this DateOnly date)
	{
		var firstMonthInQuarter = QuarterlyMonths.Where(month => date.Month >= month).Max();

		return new Month(date.Year, firstMonthInQuarter);
	}

	public static DateOnly Min(DateOnly date, DateOnly other)
	{
		return date < other ? date : other;
	}

	public static DateOnly Max(DateOnly date, DateOnly other)
	{
		return date > other ? date : other;
	}

	public static bool EqualsMonth(this DateOnly date, Month month)
	{
		return date.Year == month.Year && date.Month == month.MonthIndex;
	}

	public static IEnumerable<Month> GetMonthsUntil(this DateOnly fromDate, DateOnly untilDate)
	{
		var fromMonth = new Month(fromDate);
		var untilMonth = new Month(untilDate);

		return fromMonth.GetMonthsUntil(untilMonth);
	}

	public static IEnumerable<Week> GetWeeksThrough(this DateOnly fromDate, DateOnly lastIncludedDate)
	{
		var firstWeek = Week.FromDateOnly(fromDate);
		var lastWeek = Week.FromDateOnly(lastIncludedDate);

		return firstWeek.GetNextWeeks(lastWeek);
	}

	public static int CountDaysInTimeSpan(this IEnumerable<DateOnly> days, DateOnly fromDate, DateOnly toDateInclusive)
	{
		return days.Count(day => day >= fromDate && day <= toDateInclusive);
	}
}

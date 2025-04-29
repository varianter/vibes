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

	public static int CountWeekdaysInMonth(this Month month) => GetWeekdaysInMonth(month).Count();

	public static Month FirstMonthInQuarter(this DateOnly date)
	{
		var firstMonthInQuarter = QuarterlyMonths.Where(month => date.Month >= month).Max();

		return new Month(date.Year, firstMonthInQuarter);
	}

	public static IEnumerable<DateOnly> GetWeekdaysInMonth(this Month month)
	{
		for (var date = month.FirstDay; date.EqualsMonth(month); date = date.AddDays(1))
		{
			if (date.IsWeekday())
			{
				yield return date;
			}
		}
	}

	public static IEnumerable<Week> GetWeeksInMonth(this Month month)
	{
		return month.FirstDay.GetWeeksThrough(month.LastDay);
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

		return GetMonthsUntil(fromMonth, untilMonth);
	}

	public static IEnumerable<Month> GetMonthsUntil(this Month fromMonth, Month untilMonth)
	{
		if (untilMonth <= fromMonth)
		{
			yield break;
		}

		for (var month = fromMonth; month < untilMonth; month = month.GetNext())
		{
			yield return month;
		}
	}

	private static IEnumerable<Week> GetWeeksThrough(this DateOnly fromDate, DateOnly lastIncludedDate)
	{
		var firstWeek = Week.FromDateOnly(fromDate);
		var lastWeek = Week.FromDateOnly(lastIncludedDate);

		return firstWeek.GetNextWeeks(lastWeek);
	}

	public static IEnumerable<Week> GetWeeksThrough(this Month fromMonth, Month throughMonth)
	{
		return GetWeeksThrough(fromMonth.FirstDay, throughMonth.LastDay);
	}

	public static bool WholeMonthIsIncludedInTimeSpan(this Month month, DateOnly firstDayInTimeSpan, DateOnly lastDayInTimeSpan)
	{
		if (month.FirstDay < firstDayInTimeSpan)
		{
			return false;
		}

		if (lastDayInTimeSpan < month.LastDay)
		{
			return false;
		}

		return true;
	}

	public static int CountDaysInTimeSpan(this IEnumerable<DateOnly> days, DateOnly fromDate, DateOnly toDateInclusive)
	{
		return days.Count(day => day >= fromDate && day <= toDateInclusive);
	}
}

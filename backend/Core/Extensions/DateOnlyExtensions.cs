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

	public static DateOnly FirstDayInMonth(this DateOnly month)
	{
		if (month.Day == 1)
		{
			return month;
		}

		return new DateOnly(month.Year, month.Month, 1);
	}

	public static DateOnly LastDayInMonth(this DateOnly month)
	{
		return month.FirstDayInMonth().AddMonths(1).AddDays(-1);
	}

	public static DateOnly FirstWeekdayInMonth(this DateOnly month)
	{
		var firstDayInMonth = month.FirstDayInMonth();

		return firstDayInMonth.DayOfWeek switch
		{
			DayOfWeek.Saturday => firstDayInMonth.AddDays(2),
			DayOfWeek.Sunday => firstDayInMonth.AddDays(1),
			_ => firstDayInMonth,
		};
	}

	public static Month FirstMonthInQuarter(this DateOnly date)
	{
		var firstMonthInQuarter = QuarterlyMonths.Where(month => date.Month >= month).Max();

		return new Month(date.Year, firstMonthInQuarter);
	}

	public static IEnumerable<DateOnly> GetWeekdaysInMonth(this Month month)
	{
		for (var date = month.FirstDayInMonth(); date.EqualsMonth(month); date = date.AddDays(1))
		{
			if (date.IsWeekday())
			{
				yield return date;
			}
		}
	}

	public static IEnumerable<Week> GetWeeksInMonth(this Month month)
	{
		return month.FirstDayInMonth().GetWeeksThrough(month.LastDayInMonth());
	}

	public static DateOnly Min(DateOnly date, DateOnly other)
	{
		return date < other ? date : other;
	}

	public static DateOnly Max(DateOnly date, DateOnly other)
	{
		return date > other ? date : other;
	}

	public static bool EqualsMonth(this DateOnly month, DateOnly other)
	{
		return month.Year == other.Year && month.Month == other.Month;
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
		if (month.FirstDayInMonth() < firstDayInTimeSpan)
		{
			return false;
		}

		if (lastDayInTimeSpan < month.LastDayInMonth())
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

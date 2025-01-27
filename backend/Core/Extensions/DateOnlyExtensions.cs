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

	public static int CountWeekdaysInMonth(this DateOnly month) => GetWeekdaysInMonth(month).Count();

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

	public static DateOnly FirstDayInQuarter(this DateOnly date)
	{
		return new DateOnly(date.Year, date.FirstMonthInQuarter(), 1);
	}

	private static int FirstMonthInQuarter(this DateOnly date)
	{
		return QuarterlyMonths.Where(month => date.Month >= month).Max();
	}

	public static IEnumerable<DateOnly> GetWeekdaysInMonth(this DateOnly month)
	{
		for (var date = month.FirstDayInMonth(); date.EqualsMonth(month); date = date.AddDays(1))
		{
			if (date.IsWeekday())
			{
				yield return date;
			}
		}
	}

	public static IEnumerable<Week> GetWeeksInMonth(this DateOnly month)
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

	public static IEnumerable<DateOnly> GetMonthsUntil(this DateOnly fromMonth, DateOnly firstExcludedMonth)
	{
		if (firstExcludedMonth <= fromMonth)
		{
			yield break;
		}

		for (var month = fromMonth; month < firstExcludedMonth; month = month.AddMonths(1))
		{
			yield return month;
		}
	}

	public static IEnumerable<Week> GetWeeksThrough(this DateOnly fromDate, DateOnly lastIncludedDate)
	{
		var firstWeek = Week.FromDateOnly(fromDate);
		var lastWeek = Week.FromDateOnly(lastIncludedDate.LastDayInMonth());

		return firstWeek.GetNextWeeks(lastWeek);
	}

	public static bool WholeMonthIsIncludedInTimeSpan(this DateOnly month, DateOnly firstDayInTimeSpan, DateOnly lastDayInTimeSpan)
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

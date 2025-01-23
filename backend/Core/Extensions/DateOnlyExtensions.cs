using Core.Weeks;

namespace Core.Extensions;

public static class DateOnlyExtensions
{
	public static bool EqualsMonth(this DateOnly month, DateOnly other)
	{
		return month.Year == other.Year && month.Month == other.Month;
	}

	public static int GetTotalWeekdaysInMonth(this DateOnly month)
	{
		var firstDayInMonth = new DateOnly(month.Year, month.Month, 1);

		var weekdayCount = 0;

		for (var date = firstDayInMonth; date.EqualsMonth(month); date.AddDays(1))
		{
			if (date.IsWeekday())
			{
				weekdayCount++;
			}
		}

		return weekdayCount;
	}

	public static bool IsWeekday(this DateOnly date) => date.DayOfWeek is >= DayOfWeek.Monday and <= DayOfWeek.Friday;

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

	public static IEnumerable<Week> GetWeeksInMonth(this DateOnly month)
	{
		var firstDayOfMonth = new DateOnly(month.Year, month.Month, 1);
		var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

		return firstDayOfMonth.GetWeeksThrough(lastDayOfMonth);
	}

	public static IEnumerable<Week> GetWeeksThrough(this DateOnly fromDate, DateOnly lastIncludedDate)
	{
		var firstWeek = Week.FromDateOnly(fromDate);
		var lastWeek = Week.FromDateOnly(lastIncludedDate);

		return firstWeek.GetNextWeeks(lastWeek);
	}

	public static DateOnly FirstWeekdayInMonth(this DateOnly month)
	{
		var firstDayInMonth = new DateOnly(month.Year, month.Month, 1);

		return firstDayInMonth.DayOfWeek switch
		{
			DayOfWeek.Saturday => firstDayInMonth.AddDays(2),
			DayOfWeek.Sunday => firstDayInMonth.AddDays(1),
			_ => firstDayInMonth,
		};
	}
}

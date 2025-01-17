using Core.Weeks;

namespace Api.Helpers;

public static class DateOnlyHelper
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
			weekdayCount++;
		}

		return weekdayCount;
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
		throw new NotImplementedException();
	}
}

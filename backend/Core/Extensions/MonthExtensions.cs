using Core.Months;
using Core.Weeks;

namespace Core.Extensions;

public static class MonthExtensions
{
	public static int CountWeekdays(this Month month) => GetWeekdays(month).Count();

	public static IEnumerable<DateOnly> GetWeekdays(this Month month)
	{
		for (var date = month.FirstDay; date.EqualsMonth(month); date = date.AddDays(1))
		{
			if (date.IsWeekday())
			{
				yield return date;
			}
		}
	}

	public static IEnumerable<Week> GetWeeks(this Month month)
	{
		return month.FirstDay.GetWeeksThrough(month.LastDay);
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

	public static IEnumerable<Week> GetWeeksThrough(this Month fromMonth, Month throughMonth)
	{
		return fromMonth.FirstDay.GetWeeksThrough(throughMonth.LastDay);
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
}

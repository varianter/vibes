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

	/// <summary>
	/// Returns a Week object for each week (whole or partial) that coincide with the month
	/// </summary>
	public static IEnumerable<Week> GetWeeks(this Month month)
	{
		return month.FirstDay.GetWeeksThrough(month.LastDay);
	}

	/// <summary>
	/// Returns a Month object for each month between and including fromMonth and throughMonth
	/// </summary>
	public static IEnumerable<Month> GetMonthsThrough(this Month fromMonth, Month throughMonth)
	{
		if (throughMonth < fromMonth)
		{
			yield break;
		}

		for (var month = fromMonth; month <= throughMonth; month = month.GetNext())
		{
			yield return month;
		}
	}

	/// <summary>
	/// Returns a Week object for each week between and including fromMonth and throughMonth
	/// </summary>
	public static IEnumerable<Week> GetWeeksThrough(this Month fromMonth, Month throughMonth)
	{
		return fromMonth.FirstDay.GetWeeksThrough(throughMonth.LastDay);
	}

	/// <summary>
	/// Returns true if the time span running from firstDayInTimeSpan to lastDayInTimeSpan (inclusive) covers all the days in the month
	/// </summary>
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

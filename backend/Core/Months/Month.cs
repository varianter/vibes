namespace Core.Months;

public sealed class Month(int year, int month) : IComparable<Month>, IEquatable<Month>
{
	public Month(DateOnly date) : this(date.Year, date.Month)
	{
	}

	private DateOnly? _firstDay;
	private DateOnly? _lastDay;
	private DateOnly? _firstWeekday { get; set; }
	private DateOnly? _lastWeekday { get; set; }

	public int Year { get; } = year;
	public int MonthIndex { get; } = month;

	public DateOnly FirstDay => GetFirstDay();
	public DateOnly LastDay => GetLastDay();
	public DateOnly FirstWeekday => GetFirstWeekday();
	public DateOnly LastWeekday => GetLastWeekday();

	private DateOnly GetFirstDay()
	{
		_firstDay ??= new DateOnly(Year, MonthIndex, 1);

		return _firstDay.Value;
	}

	private DateOnly GetLastDay()
	{
		_lastDay ??= FirstDay.AddMonths(1).AddDays(-1);

		return _lastDay.Value;
	}

	private DateOnly GetFirstWeekday()
	{
		_firstWeekday ??= CalculateFirstWeekday();

		return _firstWeekday.Value;
	}

	private DateOnly GetLastWeekday()
	{
		_lastWeekday ??= CalculateLastWeekday();

		return _lastWeekday.Value;
	}

	private DateOnly CalculateFirstWeekday()
	{
		return FirstDay.DayOfWeek switch
		{
			DayOfWeek.Saturday => FirstDay.AddDays(2),
			DayOfWeek.Sunday => FirstDay.AddDays(1),
			_ => FirstDay,
		};
	}

	private DateOnly CalculateLastWeekday()
	{
		return LastDay.DayOfWeek switch
		{
			DayOfWeek.Sunday => LastDay.AddDays(-2),
			DayOfWeek.Saturday => LastDay.AddDays(-1),
			_ => LastDay,
		};
	}

	public Month GetNext() => SkipAhead(1);

	/// <summary>
	/// Returns a Month object for the month coming monthCount months after this instance
	/// </summary>
	public Month SkipAhead(int monthCount)
	{
		return new Month(FirstDay.AddMonths(monthCount));
	}

	public int CompareTo(Month? other)
	{
		if (other is null)
		{
			return 1;
		}

		if (Year == other.Year)
		{
			return MonthIndex - other.MonthIndex;
		}

		return Year - other.Year;
	}

	public bool Equals(Month? other)
	{
		if (other is null) return false;

		return Year == other.Year && MonthIndex == other.MonthIndex;
	}

	public override bool Equals(object? other)
	{
		if (other is null)
		{
			return false;
		}

		return typeof(object) == typeof(Month) && Equals(other as Month);
	}

	public override int GetHashCode()
	{
		return HashCode.Combine(Year, MonthIndex);
	}

	public static bool operator <(Month left, Month right)
	{
		if (left.Year < right.Year) return true;
		if (left.Year > right.Year) return false;
		return left.MonthIndex < right.MonthIndex;
	}

	public static bool operator >(Month left, Month right)
	{
		if (left.Year > right.Year) return true;
		if (left.Year < right.Year) return false;
		return left.MonthIndex > right.MonthIndex;
	}

	public static bool operator <=(Month left, Month right)
	{
		if (left.Year < right.Year) return true;
		if (left.Year > right.Year) return false;
		return left.MonthIndex <= right.MonthIndex;
	}

	public static bool operator >=(Month left, Month right)
	{
		if (left.Year > right.Year) return true;
		if (left.Year < right.Year) return false;
		return left.MonthIndex >= right.MonthIndex;
	}
}

namespace Core.Months;

public class Month(DateOnly date)
{
	private readonly int _year = date.Year;
	private readonly int _month = date.Month;

	private DateOnly? _firstDay;
	private DateOnly? _lastDay;
	private DateOnly? _firstWeekday { get; set; }
	private DateOnly? _lastWeekday { get; set; }

	public DateOnly FirstDay => GetFirstDay();
	public DateOnly LastDay => GetLastDay();
	public DateOnly FirstWeekday => GetFirstWeekday();
	public DateOnly LastWeekday => GetLastWeekday();

	private DateOnly GetFirstDay()
	{
		_firstDay ??= new DateOnly(_year, _month, 1);

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
}

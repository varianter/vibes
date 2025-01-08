using System.Globalization;

namespace Core.Weeks;

public sealed class Week(int year, int weekNumber) : IComparable<Week>, IEquatable<Week>
{
    public readonly int Year = year;
    public readonly int WeekNumber = weekNumber;
    public struct MonthsOfWeek
    {
        public int Month { get; init; }
        public int? SecondMonth { get; init; }
        public int Distribution { get; init; }
    }


    public static Week FromInt(int weekAsInt)
    {
        var year = weekAsInt / 100;
        var weekNumber = weekAsInt % 100;
        return new Week(year, weekNumber);
    }

    public int ToSortableInt()
    {
        return Year * 100 + WeekNumber;
    }

    public int CompareTo(Week? other)
    {
        // 1 if this is first
        // 0 if equal
        if (other is null)
            return 1;

        if (Year == other.Year) return WeekNumber - other.WeekNumber;

        return Year - other.Year;
    }

    public bool Equals(Week? other)
    {
        if (other is null) return false;
        return Year == other.Year && WeekNumber == other.WeekNumber;
    }

    public override bool Equals(object? obj)
    {
        return typeof(object) == typeof(Week) && Equals(obj as Week);
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(Year, WeekNumber);
    }

    public static Week FromDateTime(DateTime dateTime)
    {
        return new Week(dateTime.Year, GetWeekNumber(dateTime));
    }

    public static Week FromDateOnly(DateOnly dateOnly)
    {
        return new Week(dateOnly.Year, GetWeekNumber(dateOnly.ToDateTime(TimeOnly.MinValue)));
    }

    /// <summary>
    ///     Returns a string in the format Year-WeekNumber.
    ///     WeekNumber will be padded with a leading zero if needed.
    ///     <example>
    ///         For example:
    ///         <code>
    ///         Week w = new Week(2025, 1);
    ///         w.ToString()
    ///         </code>
    ///         returns <c>"2025-01"</c>
    ///     </example>
    /// </summary>
    public override string ToString()
    {
        return $"{Year}-{WeekNumber:D2}";
    }

    private static int GetWeekNumber(DateTime time)
    {
        // If it's Monday, Tuesday or Wednesday, then it'll 
        // be the same week# as whatever Thursday, Friday or Saturday are,
        // and we always get those right
        var day = CultureInfo.InvariantCulture.Calendar.GetDayOfWeek(time);
        if (day is >= DayOfWeek.Monday and <= DayOfWeek.Wednesday) time = time.AddDays(3);

        // Return the week of our adjusted day
        return CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(time, CalendarWeekRule.FirstFourDayWeek,
            DayOfWeek.Monday);
    }

    public List<Week> GetNextWeeks(int weeksAhead)
    {
        /*Calculate weeks and years based on thursday, as this is the day that is used to figure out week numbers
         at year´s end*/
        var firstThursday = FirstWorkDayOfWeek().AddDays(3);

        return Enumerable.Range(0, weeksAhead)
            .Select(offset =>
            {
                var y = firstThursday.AddDays(7 * offset).Year;
                var week = GetWeekNumber(firstThursday.AddDays(7 * offset));
                return new Week(y, week);
            }).ToList();
    }

    public List<Week> GetNextWeeks(Week otherWeek)
    {
        var numberOfWeeks = (otherWeek.FirstDayOfWorkWeek().DayNumber - FirstDayOfWorkWeek().DayNumber) / 7;

        return GetNextWeeks(numberOfWeeks + 1);
    }

    public List<DateOnly> GetDatesInWorkWeek()
    {
        var datesInWeek = new List<DateOnly>();
        var firstDayOfWeek = FirstWorkDayOfWeek();

        for (var i = 0; i < 5; i++)
        {
            var date = DateOnly.FromDateTime(firstDayOfWeek.AddDays(i));
            datesInWeek.Add(date);
        }

        return datesInWeek;
    }

    private DateTime FirstWorkDayOfWeek()
    {
        // Source: https://stackoverflow.com/a/9064954
        var jan1 = new DateOnly(Year, 1, 1).ToDateTime(TimeOnly.MinValue);
        var daysOffset = DayOfWeek.Thursday - jan1.DayOfWeek;

        // Use first Thursday in January to get first week of the year as
        // it will never be in Week 52/53
        var firstThursday = jan1.AddDays(daysOffset);
        var cal = CultureInfo.CurrentCulture.Calendar;
        var firstWeek = cal.GetWeekOfYear(firstThursday, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);

        // As we're adding days to a date in Week 1,
        // we need to subtract 1 in order to get the right date for week #1
        var weeksSinceJan1 = WeekNumber;
        if (firstWeek == 1) weeksSinceJan1 -= 1;

        // Using the first Thursday as starting week ensures that we are starting in the right year
        // then we add number of weeks multiplied with days
        var result = firstThursday.AddDays(weeksSinceJan1 * 7);

        // Subtract 3 days from Thursday to get Monday, which is the first weekday in ISO8601
        return result.AddDays(-3);
    }

    public DateOnly FirstDayOfWorkWeek()
    {
        return DateOnly.FromDateTime(FirstWorkDayOfWeek());
    }

    public DateOnly LastWorkDayOfWeek()
    {
        return FirstDayOfWorkWeek().AddDays(5);
    }

    public bool ContainsDate(DateOnly date)
    {
        return DateIsInWeek(date);
    }


    private bool DateIsInWeek(DateOnly day)
    {
        return FromDateOnly(day).Equals(this);
    }

    public MonthsOfWeek GetMonthOfWeek()
    {
        int daysFromStartOfYear = 1 + (WeekNumber - 1) * 7;
        var dayOfWeek = new DateOnly(Year, 1, 1).AddDays(daysFromStartOfYear - 1); // Adjust start of year to the calculated day
        var monday = GetPreviousOrCurrentMonday(dayOfWeek);
        int month = monday.Month;

        double distribution = 100;
        int? secondMonth = null;

        for (int i = 1; i < 7; i++)
        {
            var addedDayDate = monday.AddDays(i);
            if (addedDayDate.Month != month)
            {
                distribution = (distribution / 7) * i;
                secondMonth = addedDayDate.Month;
                break;
            }
        }

        return new MonthsOfWeek
        {
            Month = month,
            SecondMonth = secondMonth,
            Distribution = (int)distribution
        };
    }
    static DateOnly GetPreviousOrCurrentMonday(DateOnly date)
    {
        if (date.DayOfWeek == DayOfWeek.Monday)
        {
            return date;
        }
        int daysToSubtract = (date.DayOfWeek - DayOfWeek.Monday + 7) % 7;
        return date.AddDays(-daysToSubtract);
    }

    public static bool operator ==(Week left, Week right)
    {
        if (ReferenceEquals(left, right)) return true;
        if (ReferenceEquals(left, null)) return false;
        if (ReferenceEquals(right, null)) return false;
        return left.Year == right.Year && left.WeekNumber == right.WeekNumber;
    }

    public static bool operator !=(Week left, Week right)
    {
        return !(left == right);
    }

    public static bool operator <(Week left, Week right)
    {
        if (left.Year < right.Year) return true;
        if (left.Year > right.Year) return false;
        return left.WeekNumber < right.WeekNumber;
    }

    public static bool operator >(Week left, Week right)
    {
        if (left.Year > right.Year) return true;
        if (left.Year < right.Year) return false;
        return left.WeekNumber > right.WeekNumber;
    }

    public static bool operator <=(Week left, Week right)
    {
        if (left.Year < right.Year) return true;
        if (left.Year > right.Year) return false;
        return left.WeekNumber <= right.WeekNumber;
    }

    public static bool operator >=(Week left, Week right)
    {
        if (left.Year > right.Year) return true;
        if (left.Year < right.Year) return false;
        return left.WeekNumber >= right.WeekNumber;
    }
}
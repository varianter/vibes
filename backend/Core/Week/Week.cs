using System.Globalization;

namespace Core.DomainModels;

public class Week : IComparable<Week>, IEquatable<Week>
{
    public readonly int WeekNumber;

    public readonly int Year;

    public Week(int year, int weekNumber)
    {
        Year = year;
        WeekNumber = weekNumber;
    }

    public Week(int weekAsInt)
    {
        Year = weekAsInt / 100;
        WeekNumber = weekAsInt % 100;
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


    public static Week FromDateTime(DateTime dateTime)
    {
        return new Week(dateTime.Year, GetWeekNumber(dateTime));
    }

    public static Week FromDateOnly(DateOnly dateOnly)
    {
        return new Week(dateOnly.Year, GetWeekNumber(dateOnly.ToDateTime(TimeOnly.MinValue)));
    }

    /// <summary>
    ///     Returns a string in the format yyyyww where y is year and w is week
    ///     Example: 202352 or 202401
    /// </summary>
    public override string ToString()
    {
        return $"{ToSortableInt()}";
    }

    /// <summary>
    ///     Returns an int in the format yyyyww where y is year and w is week
    ///     Example: 202352 or 202401
    /// </summary>
    public int ToSortableInt()
    {
        return Year * 100 + WeekNumber;
    }

    private static int GetWeekNumber(DateTime time)
    {
        // If its Monday, Tuesday or Wednesday, then it'll 
        // be the same week# as whatever Thursday, Friday or Saturday are,
        // and we always get those right
        var day = CultureInfo.InvariantCulture.Calendar.GetDayOfWeek(time);
        if (day >= DayOfWeek.Monday && day <= DayOfWeek.Wednesday) time = time.AddDays(3);

        // Return the week of our adjusted day
        return CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(time, CalendarWeekRule.FirstFourDayWeek,
            DayOfWeek.Monday);
    }

    public List<Week> GetNextWeeks(int weeksAhead)
    {
        /*Calculate weeks and years based on thursday, as this is the day that is used to figure out weeknumbers
         at year´s end*/
        var firstThursday = FirstWorkDayOfWeek().AddDays(3);

        return Enumerable.Range(0, weeksAhead)
            .Select(offset =>
            {
                var year = firstThursday.AddDays(7 * offset).Year;
                var week = GetWeekNumber(firstThursday.AddDays(7 * offset));
                return new Week(year, week);
            }).ToList();
    }
    
    public List<Week> GetNextWeeks(Week otherWeek)
    {
        var numberOfWeeks = (otherWeek.FirstDayOfWorkWeek().DayNumber - FirstDayOfWorkWeek().DayNumber) / 7;

        return GetNextWeeks(numberOfWeeks+1);
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
        var jan1 = new DateTime(Year, 1, 1);
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
}
using System.Globalization;

namespace backend.ApplicationCore.Services;

public class DateService
{
    // This presumes that weeks start with Monday.
    // Week 1 is the 1st week of the year with a Thursday in it.
    public static int GetWeekNumber(DateTime time)
    {
        // Seriously cheat.  If its Monday, Tuesday or Wednesday, then it'll 
        // be the same week# as whatever Thursday, Friday or Saturday are,
        // and we always get those right
        var day = CultureInfo.InvariantCulture.Calendar.GetDayOfWeek(time);
        if (day >= DayOfWeek.Monday && day <= DayOfWeek.Wednesday) time = time.AddDays(3);

        // Return the week of our adjusted day
        return CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(time, CalendarWeekRule.FirstFourDayWeek,
            DayOfWeek.Monday);
    }

    public static int GetWeekNumber()
    {
        return GetWeekNumber(DateTime.Today);
    }

    public static bool DateIsInWeek(DateTime day, int week)
    {
        return GetWeekNumber(day) == week;
    }

    public static bool DateIsInWeek(DateOnly day, int week)
    {
        return GetWeekNumber(day.ToDateTime(TimeOnly.MinValue)) == week;
    }
}
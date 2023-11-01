using System.Globalization;
using Core.DomainModels;

namespace Core.Services;

public class DateService
{
    public static DateOnly GetFirstDayOfWeekContainingDate(DateTime time)
    {
        return DateOnly.FromDateTime(FirstWorkDayOfWeek(time.Year, GetWeekNumber(time)));
    }

    // This presumes that weeks start with Monday.
    // Week 1 is the 1st week of the year with a Thursday in it.
    public static int GetWeekNumber(DateTime time)
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

    public static int GetWeekAhead(int offset)
    {
        return GetWeekNumber(DateTime.Today.AddDays(7 * offset));
    }

    public static bool DateIsInWeek(DateOnly day, int year, int week)
    {
        return day.Year == year && GetWeekNumber(day.ToDateTime(TimeOnly.MinValue)) == week;
    }

    public static List<Week> GetNextWeeks(Week firstWeek, int weeksAhead)
    {
        var a = FirstWorkDayOfWeek(firstWeek.Year, firstWeek.WeekNumber);
        return Enumerable.Range(0, weeksAhead)
            .Select(offset =>
            {
                var year = a.AddDays(7 * offset).Year;
                var week = GetWeekNumber(a.AddDays(7 * offset));

                return new Week(year, week);
            }).ToList();
    }


    public static List<DateOnly> GetDatesInWorkWeek(int year, int week)
    {
        var datesInWeek = new List<DateOnly>();
        var firstDayOfWeek = FirstWorkDayOfWeek(year, week);

        for (var i = 0; i < 5; i++)
        {
            var date = DateOnly.FromDateTime(firstDayOfWeek.AddDays(i));
            datesInWeek.Add(date);
        }

        return datesInWeek;
    }


    private static DateTime FirstWorkDayOfWeek(int year, int weekOfYear)
    {
        // Source: https://stackoverflow.com/a/9064954
        var jan1 = new DateTime(year, 1, 1);
        var daysOffset = DayOfWeek.Thursday - jan1.DayOfWeek;

        // Use first Thursday in January to get first week of the year as
        // it will never be in Week 52/53
        var firstThursday = jan1.AddDays(daysOffset);
        var cal = CultureInfo.CurrentCulture.Calendar;
        var firstWeek = cal.GetWeekOfYear(firstThursday, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);

        var weekNum = weekOfYear;
        // As we're adding days to a date in Week 1,
        // we need to subtract 1 in order to get the right date for week #1
        if (firstWeek == 1) weekNum -= 1;

        // Using the first Thursday as starting week ensures that we are starting in the right year
        // then we add number of weeks multiplied with days
        var result = firstThursday.AddDays(weekNum * 7);

        // Subtract 3 days from Thursday to get Monday, which is the first weekday in ISO8601
        return result.AddDays(-3);
    }
}
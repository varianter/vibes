namespace Core.Weeks;
public static class WeekExtensions
{

    public struct MonthsOfWeek
    {
        public int Month { get; init; }
        public int? SecondMonth { get; init; }
        public int Distribution { get; init; }
    }

    public static MonthsOfWeek GetMonthOfWeek(this Week week)
    {
        int daysFromStartOfYear = 1 + (week.WeekNumber - 1) * 7;
        var dayOfWeek = new DateOnly(week.Year, 1, 1).AddDays(daysFromStartOfYear - 1); // Adjust start of year to the calculated day
        var monday = dayOfWeek.GetPreviousOrCurrentMonday();
        int month = monday.Month;

        double distribution = 100;
        int? secondMonth = null;

        for (int i = 1; i < 7; i++)
        {
            var addedDayDate = monday.AddDays(i);
            if (addedDayDate.Month != month)
            {
                distribution = distribution / 7 * i;
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
    public static DateOnly GetPreviousOrCurrentMonday(this DateOnly date)
    {
        if (date.DayOfWeek == DayOfWeek.Monday)
        {
            return date;
        }
        int daysToSubtract = (date.DayOfWeek - DayOfWeek.Monday + 7) % 7;
        return date.AddDays(-daysToSubtract);
    }
}
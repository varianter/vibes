namespace Core.DomainModels;

public class Month
{
    public readonly int MonthNumber;

    public readonly int Year;

    public Month(int year, int monthNumber)
    {
        Year = year;
        MonthNumber = monthNumber;
    }

    public Month(int monthAsInt)
    {
        Year = monthAsInt / 100;
        MonthNumber = monthAsInt % 100;
    }

    /// <summary>
    ///     Returns a string in the format yyyymm where y is year and m is month
    ///     Example: 202401 or 202410
    /// </summary>
    public override string ToString()
    {
        return $"{ToSortableInt()}";
    }

    /// <summary>
    ///     Returns an int in the format yyyymm where y is year and m is month
    ///     Example: 202401 or 202410
    /// </summary>
    public int ToSortableInt()
    {
        return Year * 100 + MonthNumber;
    }

    public Week GetWeekNumberOfFirstDayInMonth()
    {
        return Week.FromDateTime(new DateTime(Year, MonthNumber, 1));
    }

    public Week GetWeekNumberOfLastDayInMonth()
    {
        return Week.FromDateTime(new DateTime(Year, MonthNumber, DateTime.DaysInMonth(Year, MonthNumber)));
    }
}
namespace Core.DomainModels;

public class Week : IComparable<Week>, IEquatable<Week>
{
    public Week(int year, int weekNumber)
    {
        Year = year;
        WeekNumber = weekNumber;
    }

    public int Year { get; set; }
    public int WeekNumber { get; set; }


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
}
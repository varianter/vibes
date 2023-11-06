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
    
    public override string ToString()
    {
        return ($"{Year}{WeekNumber}");
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
}
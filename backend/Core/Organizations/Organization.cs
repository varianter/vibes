using System.Text.Json.Serialization;
using Core.Absences;
using Core.Customers;
using Core.DomainModels;
using PublicHoliday;

// ReSharper disable EntityFramework.ModelValidation.UnlimitedStringLength
// ReSharper disable CollectionNeverUpdated.Global

namespace Core.Organizations;

public class Organization
{
    public required string Id { get; init; } // guid ? Decide What to set here first => 
    public required string Name { get; init; }
    public required string UrlKey { get; init; } // "variant-as", "variant-sverige"
    public required string Country { get; init; }
    public required int NumberOfVacationDaysInYear { get; init; }
    public required bool HasVacationInChristmas { get; init; }
    public required double HoursPerWorkday { get; init; }

    [JsonIgnore] public List<Department> Departments { get; init; } = [];
    public required List<Customer> Customers { get; init; }
    public required List<Absence> AbsenceTypes { get; init; }

    private int GetTotalHolidaysOfWeek(Week week)
    {
        var datesOfThisWeek = week.GetDatesInWorkWeek();
        return datesOfThisWeek.Count(IsHoliday);
    }

    public double GetTotalHolidayHoursOfWeek(Week week)
    {
        var holidayDays = GetTotalHolidaysOfWeek(week);
        return holidayDays * HoursPerWorkday;
    }

    private bool IsHoliday(DateOnly day)
    {
        return IsPublicHoliday(day) || IsChristmasHoliday(day);
    }

    private bool IsPublicHoliday(DateOnly day)
    {
        var publicHoliday = GetPublicHoliday();
        var isPublicHoliday = publicHoliday.IsPublicHoliday(day.ToDateTime(TimeOnly.MinValue));
        return isPublicHoliday;
    }

    private PublicHolidayBase GetPublicHoliday()
    {
        var country = Country;

        return country switch
        {
            "norway" => new NorwayPublicHoliday(),
            "sweden" => new SwedenPublicHoliday(),
            _ => new NorwayPublicHoliday()
        };
    }

    private bool IsChristmasHoliday(DateOnly date)
    {
        if (!HasVacationInChristmas) return false;

        var startDate = new DateOnly(date.Year, 12, 24);
        var endDate = new DateOnly(date.Year, 12, 31);

        return date >= startDate && date <= endDate;
    }

    public List<DateOnly> GetPublicHolidays(int year)
    {
        var publicHoliday = GetPublicHoliday();
        var publicHolidays = publicHoliday.PublicHolidays(year).Select(DateOnly.FromDateTime).ToList();
        if (!HasVacationInChristmas) return publicHolidays;

        publicHolidays = publicHolidays
            .Concat(GetChristmasHolidays(year))
            .Distinct()
            .ToList();

        return publicHolidays;
    }

    private static List<DateOnly> GetChristmasHolidays(int year)
    {
        var startDate = new DateOnly(year, 12, 24).ToDateTime(TimeOnly.MinValue);
        var endDate = new DateOnly(year, 12, 31).ToDateTime(TimeOnly.MinValue);
        return Enumerable.Range(0, 1 + endDate.Subtract(startDate).Days)
            .Select(offset => DateOnly.FromDateTime(startDate.AddDays(offset)))
            .ToList();
    }
}
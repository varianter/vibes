using System.Text.Json.Serialization;
using Core.Absences;
using Core.Customers;
using Core.DomainModels;
using PublicHoliday;

namespace Core.Organizations;

public class Organization
{
    public required string Id { get; set; } // guid ? Decide What to set here first => 
    public required string Name { get; set; }
    public required string UrlKey { get; set; } // "variant-as", "variant-sverige"
    public required string Country { get; set; }
    public required int NumberOfVacationDaysInYear { get; set; }
    public required bool HasVacationInChristmas { get; set; }
    public required double HoursPerWorkday { get; set; }

    [JsonIgnore] public List<Department> Departments { get; set; }

    public required List<Customer> Customers { get; set; }

    public List<Absence> AbsenceTypes { get; set; }

    public int GetTotalHolidaysOfWeek(Week week)
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
        if (HasVacationInChristmas)
        {
            var startDate = new DateTime(year, 12, 24);
            var endDate = new DateTime(year, 12, 31);
            var list = Enumerable.Range(0, 1 + endDate.Subtract(startDate).Days)
                .Select(offset => DateOnly.FromDateTime(startDate.AddDays(offset)))
                .ToList();
            publicHolidays = publicHolidays.Concat(list).Distinct().ToList();
        }

        return publicHolidays;
    }
}
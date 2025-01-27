using System.Text.Json.Serialization;
using Core.Absences;
using Core.Customers;
using Core.Extensions;
using Core.Weeks;
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

    public IEnumerable<DateOnly> GetHolidaysInWeek(Week week)
    {
        var datesOfWorkWeek = week.GetDatesInWorkWeek();
        return datesOfWorkWeek.Where(IsHoliday);
    }

    private int GetTotalHolidaysOfWeek(Week week)
    {
        return GetHolidaysInWeek(week).Count();
    }

    public double GetTotalHolidayHoursOfWeek(Week week)
    {
        var holidayDays = GetTotalHolidaysOfWeek(week);
        return holidayDays * HoursPerWorkday;
    }

    /// <summary>
    /// Returns the count of holidays that occur on a weekday (work day) within the given month
    /// </summary>
    public int GetTotalHolidaysInMonth(DateOnly month)
    {
        return GetHolidaysInMonth(month).Count();
    }

    /// <summary>
    /// Returns all holidays that occur on a weekday (work day) within the given month
    /// </summary>
    public IEnumerable<DateOnly> GetHolidaysInMonth(DateOnly month)
    {
        return GetPublicHolidays(month.Year)
            .Where(holiday => holiday.EqualsMonth(month))
            .Where(DateOnlyExtensions.IsWeekday);
    }

    /// <summary>
    /// Returns the total amount of hours for the holidays that occur on a weekday (work day) within the given month
    /// </summary>
    public double GetTotalHolidayHoursInMonth(DateOnly month)
    {
        var holidayDays = GetTotalHolidaysInMonth(month);
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

    /// <summary>
    /// Returns a list of dates for all the public holidays and organization-provided holidays for the given year
    /// </summary>
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
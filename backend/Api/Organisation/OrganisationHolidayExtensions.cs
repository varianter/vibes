using Core.DomainModels;
using Core.Organization;
using PublicHoliday;

namespace Api.Organisation;

public static class OrganisationHolidayExtensions
{
    public static int GetTotalHolidaysOfWeek(this Organization organization, Week week)
    {
        var datesOfThisWeek = week.GetDatesInWorkWeek();
        return datesOfThisWeek.Count(organization.IsHoliday);
    }

    public static double GetTotalHolidayHoursOfWeek(this Organization organization, Week week)
    {
        var holidayDays = organization.GetTotalHolidaysOfWeek(week);
        return holidayDays * organization.HoursPerWorkday;
    }

    private static bool IsHoliday(this Organization organization, DateOnly day)
    {
        return organization.IsPublicHoliday(day) || organization.IsChristmasHoliday(day);
    }

    private static bool IsPublicHoliday(this Organization organization, DateOnly day)
    {
        var publicHoliday = organization.GetPublicHoliday();
        var isPublicHoliday = publicHoliday.IsPublicHoliday(day.ToDateTime(TimeOnly.MinValue));
        return isPublicHoliday;
    }

    private static PublicHolidayBase GetPublicHoliday(this Organization organization)
    {
        var country = organization.Country;

        return country switch
        {
            "norway" => new NorwayPublicHoliday(),
            "sweden" => new SwedenPublicHoliday(),
            _ => new NorwayPublicHoliday()
        };
    }

    private static bool IsChristmasHoliday(this Organization organization, DateOnly date)
    {
        if (!organization.HasVacationInChristmas) return false;

        var startDate = new DateOnly(date.Year, 12, 24);
        var endDate = new DateOnly(date.Year, 12, 31);

        return date >= startDate && date <= endDate;
    }

    public static List<DateOnly> GetPublicHolidays(this Organization organization, int year)
    {
        var publicHoliday = organization.GetPublicHoliday();
        var publicHolidays = publicHoliday.PublicHolidays(year).Select(DateOnly.FromDateTime).ToList();
        if (organization.HasVacationInChristmas)
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
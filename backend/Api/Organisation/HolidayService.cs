using Core.DomainModels;
using Core.Services;
using PublicHoliday;

namespace Api.Organisation;

public static class HolidayService
{
    public static int GetTotalHolidaysOfWeek(this Organization organization, int year, int week)
    {
        var datesOfThisWeek = DateService.GetDatesInWorkWeek(year, week);
        return datesOfThisWeek.Count(organization.IsHoliday);
    }

    private static bool IsHoliday(this Organization organization, DateOnly day)
    {
        return organization.IsPublicHoliday(day) || organization.IsVariantChristmasHoliday(day);
    }

    private static bool IsPublicHoliday(this Organization organization, DateOnly day)
    {
        var publicHoliday = organization.GetPublicHoliday();
        var isPublicHoliday = publicHoliday.IsPublicHoliday(day.ToDateTime(TimeOnly.MinValue));
        return isPublicHoliday || organization.IsVariantChristmasHoliday(day);
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

    private static bool IsVariantChristmasHoliday(this Organization organization, DateOnly date)
    {
        if (organization.HasVacationInChristmas) return false;

        var startDate = new DateOnly(date.Year, 12, 24);
        var endDate = new DateOnly(date.Year, 12, 31);

        return date >= startDate && date <= endDate;
    }
}
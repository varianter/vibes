using Core.DomainModels;
using Core.Services;
using PublicHoliday;

namespace Api.Consultants;

public static class HolidayService
{
    public static int GetTotalHolidaysOfWeek(this Consultant consultant, int year, int week)
    {
        var datesOfThisWeek = DateService.GetDatesInWorkWeek(year, week);
        return datesOfThisWeek.Count(consultant.IsHoliday);
    }

    private static bool IsHoliday(this Consultant consultant, DateOnly day)
    {
        var holidayCountry = consultant.GetHolidayCountry();
        var isPublicHoliday = holidayCountry.IsPublicHoliday(day.ToDateTime(TimeOnly.MinValue));
        return isPublicHoliday || consultant.IsVariantChristmasHoliday(day);
    }

    private static PublicHolidayBase GetHolidayCountry(this Consultant consultant)
    {
        var country = consultant.Department.Organization.Country;

        return country switch
        {
            "norway" => new NorwayPublicHoliday(),
            "sweden" => new SwedenPublicHoliday(),
            _ => new NorwayPublicHoliday()
        };
    }

    private static bool IsVariantChristmasHoliday(this Consultant consultant, DateOnly date)
    {
        if (consultant.Department.Organization.HasVacationInChristmas) return false;

        var startDate = new DateOnly(date.Year, 12, 24);
        var endDate = new DateOnly(date.Year, 12, 31);

        return date >= startDate && date <= endDate;
    }
}
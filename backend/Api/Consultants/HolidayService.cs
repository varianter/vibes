using Api.Options;
using Core.Services;
using PublicHoliday;

namespace Api.Consultants;

public static class HolidayService
{
    public static int GetTotalHolidaysOfWeek(int year, int week)
    {
        var datesOfThisWeek = DateService.GetDatesInWorkWeek(year, week);
        return datesOfThisWeek.Count(IsHoliday);
    }

    private static bool IsHoliday(DateOnly day)
    {
        var holidayCountry = GetHolidayCountry();
        var isPublicHoliday = holidayCountry.IsPublicHoliday(day.ToDateTime(TimeOnly.MinValue));
        return isPublicHoliday || IsVariantChristmasHoliday(day);
    }

    private static PublicHolidayBase GetHolidayCountry()
    {
        var country = ConfigSingleton.GetConfig().Country;

        return country switch
        {
            "norway" => new NorwayPublicHoliday(),
            "sweden" => new SwedenPublicHoliday(),
            _ => new NorwayPublicHoliday()
        };
    }

    private static bool IsVariantChristmasHoliday(DateOnly date)
    {
        if (!ConfigSingleton.GetConfig().HasVacationInChristmas)
        {
            return false;
        }

        var startDate = new DateOnly(date.Year, 12, 24);
        var endDate = new DateOnly(date.Year, 12, 31);

        return date >= startDate && date <= endDate;
    }
}
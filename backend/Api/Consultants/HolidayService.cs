using Api.Options;
using Core.Services;
using Microsoft.Extensions.Options;
using PublicHoliday;

namespace Api.Consultants;

public class HolidayService
{
    private readonly OrganizationOptions _organizationOptions;

    public HolidayService(IOptions<OrganizationOptions> options)
    {
        _organizationOptions = options.Value;
    }

    public int GetTotalHolidaysOfWeek(int year, int week)
    {
        var datesOfThisWeek = DateService.GetDatesInWorkWeek(year, week);
        return datesOfThisWeek.Count(IsHoliday);
    }

    private bool IsHoliday(DateOnly day)
    {
        var holidayCountry = GetHolidayCountry();
        var isPublicHoliday = holidayCountry.IsPublicHoliday(day.ToDateTime(TimeOnly.MinValue));
        return isPublicHoliday || IsVariantChristmasHoliday(day);
    }

    private PublicHolidayBase GetHolidayCountry()
    {
        var country = _organizationOptions.Country;

        return country switch
        {
            "norway" => new NorwayPublicHoliday(),
            "sweden" => new SwedenPublicHoliday(),
            _ => new NorwayPublicHoliday()
        };
    }

    private bool IsVariantChristmasHoliday(DateOnly date)
    {
        if (!_organizationOptions.HasVacationInChristmas) return false;

        var startDate = new DateOnly(date.Year, 12, 24);
        var endDate = new DateOnly(date.Year, 12, 31);

        return date >= startDate && date <= endDate;
    }
}
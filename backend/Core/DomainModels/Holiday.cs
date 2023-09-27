using backend.Core.Services;
using PublicHoliday;

namespace backend.Core.DomainModels;

public static class Holiday
{
    public static int GetTotalHolidaysOfWeek(int year, int week)
    {
        var datesOfThisWeek = DateService.GetDatesInWorkWeek(year, week);

        return datesOfThisWeek.Count(IsHoliday);
    }

    private static bool IsHoliday(DateOnly day)
    {
        var isPublicHoliday = new NorwayPublicHoliday().IsPublicHoliday(day.ToDateTime(TimeOnly.MinValue));

        return isPublicHoliday || IsVariantChristmasHoliday(day);
    }


    private static bool IsVariantChristmasHoliday(DateOnly date)
    {
        var startDate = new DateOnly(date.Year, 12, 24);
        var endDate = new DateOnly(date.Year, 12, 31);

        return date >= startDate && date <= endDate;
    }
}
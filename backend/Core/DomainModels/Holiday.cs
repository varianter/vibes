using backend.Core.Services;
using PublicHoliday;

namespace backend.Core.DomainModels;

public static class Holiday
{
    public static double GetTotalHolidayHoursOfWeek(int year, int week, double hoursPerWorkWeek = 7.5)
    {
        var datesOfThisWeek = DateService.GetDatesInWorkWeek(year, week);
        var totalHolidayHoursInWeek = 0.0;

        foreach (var workDayDate in datesOfThisWeek)
        {
            var dateTimeDay = workDayDate.ToDateTime(TimeOnly.Parse("12:00"));
            var isPublicHoliday = new NorwayPublicHoliday().IsPublicHoliday(dateTimeDay);

            var isVariantChristmas = !isPublicHoliday && IsVariantChristmasHoliday(workDayDate);

            if (isPublicHoliday || isVariantChristmas)
            {
                totalHolidayHoursInWeek += hoursPerWorkWeek;
            }
        }

        return totalHolidayHoursInWeek;
    }


    private static bool IsVariantChristmasHoliday(DateOnly dateOnly)
    {
        var startDate = new DateOnly(dateOnly.Year, 12, 24);
        var endDate = new DateOnly(dateOnly.Year, 12, 31);
        
        return dateOnly >= startDate && dateOnly <= endDate;

    }
}
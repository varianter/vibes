using Core.DomainModels;
using Core.Options;
using Core.Services;


namespace Api.Consultants;

public static class ConsultantExtensions
{
    public static double GetBookedHours(this Consultant consultant, int year, int week)
    {
        var hoursPrWorkDay = OrganizationOptions.Current.HoursPerWorkday;

        Console.WriteLine(hoursPrWorkDay);
        var holidayHours = Holiday.GetTotalHolidaysOfWeek(year, week) * hoursPrWorkDay;
        var vacationHours = consultant.Vacations.Count(v => DateService.DateIsInWeek(v.Date, year, week)) *
                            hoursPrWorkDay;

        var plannedAbsenceHours = consultant.PlannedAbsences
            .Where(pa => pa.Year == year && pa.WeekNumber == week)
            .Select(pa => pa.Hours)
            .Sum();

        var staffedHours = consultant.Staffings
            .Where(s => s.Year == year && s.Week == week)
            .Select(s => s.Hours)
            .Sum();

        var bookedHours = holidayHours + vacationHours + plannedAbsenceHours + staffedHours;
        return Math.Min(bookedHours, 5 * hoursPrWorkDay);
    }

    public static List<BookedHoursPerWeek> GetBookedHoursForWeeks(
        this Consultant consultant, int weeksAhead)
    {
        return Enumerable.Range(0, weeksAhead)
            .Select(offset =>
            {
                var year = DateTime.Today.AddDays(7 * offset).Year;
                var week = DateService.GetWeekAhead(offset);

                return new BookedHoursPerWeek(
                    year,
                    week,
                    GetBookedHours(consultant, year, week)
                );
            })
            .ToList();
    }

    public static double GetHoursPrWeek()
    {
        return OrganizationOptions.Current.HoursPerWorkday * 5;
    }
}
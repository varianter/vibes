using Core.DomainModels;
using Core.Services;

namespace Api.Consultants;

public static class ConsultantService
{
    public static ConsultantReadModel MapConsultantToReadModel(this Consultant consultant, int weeks)
    {
        const double tolerance = 0.1;
        var bookedHours = GetBookedHoursForWeeks(consultant, weeks);

        var isOccupied = bookedHours.All(b => b.BookedHours >= GetHoursPrWeek(consultant) - tolerance);

        return new ConsultantReadModel(
            consultant.Id,
            consultant.Name,
            consultant.Email,
            consultant.Competences.Select(comp => comp.Name).ToList(),
            consultant.Department.Name,
            bookedHours,
            isOccupied
        );
    }

    public static double GetBookedHours(this Consultant consultant, int year, int week)
    {
        var hoursPrWorkDay = consultant.Department.Organization.HoursPerWorkday;

        var holidayHours = consultant.GetTotalHolidaysOfWeek(year, week) * hoursPrWorkDay;
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

    private static List<BookedHoursPerWeek> GetBookedHoursForWeeks(this Consultant consultant, int weeksAhead)
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

    private static double GetHoursPrWeek(this Consultant consultant)
    {
        return consultant.Department.Organization.HoursPerWorkday * 5;
    }   
}
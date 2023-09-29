using System.ComponentModel.DataAnnotations.Schema;
using Core.Services;

namespace Core.DomainModels;

public class Consultant
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public required string Name { get; set; }
    public required string Email { get; set; }

    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }

    public required Department Department { get; set; }

    public Degree? Degree { get; set; }
    public int? GraduationYear { get; set; }

    public List<Competence> Competences { get; set; } = new();

    public List<Vacation> Vacations { get; set; } = new();

    public List<PlannedAbsence> PlannedAbsences { get; set; } = new();

    public List<Project> Projects { get; set; } = new();

    public List<Staffing> Staffings { get; set; } = new();

    public double GetBookedHours(int year, int week)
    {
        var hoursPrWorkDay = Department.Organization.HoursPerWorkday;
        var holidayHours = Holiday.GetTotalHolidaysOfWeek(year, week) * hoursPrWorkDay;
        var vacationHours = Vacations.Count(v => DateService.DateIsInWeek(v.Date, year, week)) * hoursPrWorkDay;

        var plannedAbsenceHours = PlannedAbsences
            .Where(pa => pa.Year == year && pa.WeekNumber == week)
            .Select(pa => pa.Hours)
            .Sum();

        var staffedHours = Staffings
            .Where(s => s.Year == year && s.Week == week)
            .Select(s => s.Hours)
            .Sum();

        var bookedHours = holidayHours + vacationHours + plannedAbsenceHours + staffedHours;
        return Math.Min(bookedHours, 5 * hoursPrWorkDay);
    }

    public List<BookedHoursPerWeek> GetBookedHoursForWeeks(int weeksAhead)
    {
        return Enumerable.Range(0, weeksAhead)
            .Select(offset =>
            {
                var year = DateTime.Today.AddDays(7 * offset).Year;
                var week = DateService.GetWeekAhead(offset);

                return new BookedHoursPerWeek(
                    year,
                    week,
                    GetBookedHours(year, week)
                );
            })
            .ToList();
    }

    public double GetHoursPrWeek()
    {
        return Department.Organization.HoursPerWorkday * 5;
    }
}

public class Competence
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required string Id { get; set; }

    public required string Name { get; set; }
}

public enum Degree
{
    Master,
    Bachelor,
    None
}

public record BookedHoursPerWeek(int Year, int WeekNumber, double BookedHours);
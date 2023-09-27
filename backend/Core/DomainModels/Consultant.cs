using System.ComponentModel.DataAnnotations.Schema;
using backend.Core.Services;

namespace backend.Core.DomainModels;

public class Consultant
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required int Id { get; set; }

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

    public double GetAvailableHours(int year, int week)
    {
        var hoursPrWorkDay = Department.Organization.HoursPerWorkday;
        var totalWeeklyHours = hoursPrWorkDay * 5;
        var vacationHours = Vacations.Count(v => DateService.DateIsInWeek(v.Date, year, week)) * hoursPrWorkDay;
        var holidayHours = Holiday.GetTotalHolidayHoursOfWeek(year, week, hoursPrWorkDay);

        var totalAbsence = PlannedAbsences
            .Where(pa => pa.Year == year && pa.WeekNumber == week)
            .Select(pa => pa.Hours)
            .Sum();

        var availableHours = totalWeeklyHours - vacationHours - totalAbsence - holidayHours;
        return Math.Max(availableHours, 0);
    }

    public List<AvailabilityPerWeek> GetAvailableHoursForNWeeks(int n)
    {
        return Enumerable.Range(0, n)
            .Select(weeksAhead =>
            {
                var year = DateTime.Today.AddDays(7 * weeksAhead).Year;
                var week = DateService.GetWeekAhead(weeksAhead);

                return new AvailabilityPerWeek(
                    year,
                    week,
                    GetAvailableHours(year, week)
                );
            })
            .ToList();
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

public record AvailabilityPerWeek(int Year, int WeekNumber, double AvailableHours);
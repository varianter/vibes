using System.ComponentModel.DataAnnotations.Schema;
using backend.ApplicationCore.Services;

namespace backend.ApplicationCore.DomainModels;

public class Consultant
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required int Id { get; set; }

    public required string Name { get; set; }
    public required string Email { get; set; }

    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }

    // TODO: Add department
    public required Department Department { get; set; }

    public Degree? Degree { get; set; }
    public int? GraduationYear { get; set; }

    public List<Competence> Competences { get; set; } = new();

    public List<Vacation> Vacations { get; set; } = new();

    public List<PlannedAbsence> PlannedAbsences { get; set; } = new();

    public double GetAvailabilityFraction(int year, int week)
    {
        var vacationDays =
            Vacations.Count(v => DateService.DateIsInWeek(v.Date, week));

        var plannedAbsenceFraction = PlannedAbsences
            .Where(pa => pa.Year == year && pa.WeekNumber == week)
            // If a consultant has less than a whole week of leave, this will factor that in.  
            // Example: Start an 20% leave on wednesday. 3 of 5 days have a 20% leave. 3/5 days = 60% of the week. 
            // This means that week has a total of 20% * 60% leave.
            .Select(pa => pa.Fraction * pa.ApplicableDays / 5)
            .DefaultIfEmpty(0)
            .Sum();

        // Part of week that's not vacation or holidays
        var activeWeekFraction = 1 - vacationDays * 0.2; //TODO add holidays

        var workFraction = 1 - plannedAbsenceFraction;

        return Math.Round(activeWeekFraction * workFraction, 2);
    }

    public double GetAvailableHours(int year, int week)
    {
        return GetAvailabilityFraction(year, week) * Department.Organization.HoursPerWorkday * 5;
    }

    public double GetAvailableHours()
    {
        return GetAvailableHours(DateTime.Now.Year, DateService.GetWeekNumber());
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
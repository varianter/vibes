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

    public int YearsOfExperience
    {
        get
        {
            var augustThisYear = new DateTime(DateTime.Now.Year, 9, 20);
            var currentAcademicYear =
                (DateTime.Now - augustThisYear).Seconds > 0 ? DateTime.Now.Year : DateTime.Now.Year - 1;
            return currentAcademicYear - GraduationYear ?? currentAcademicYear;
        }
    }

    public double HoursPrWorkDay => Department.Organization.HoursPerWorkday;

    public double GetVacationHoursForWeek(Week week)
    {
        return Vacations.Count(v => DateService.DateIsInWeek(v.Date, week)) *
               HoursPrWorkDay;
    }

    public double GetAbsenceHoursForWeek(Week week)
    {
        return PlannedAbsences
            .Where(pa => pa.Year == week.Year && pa.WeekNumber == week.WeekNumber)
            .Select(pa => pa.Hours)
            .Sum();
    }

    public double GetBillableHoursForWeek(Week week)
    {
        return Staffings
            .Where(s => s.Year == week.Year && s.Week == week.WeekNumber && s.Project.State.Equals(ProjectState.Active))
            .Select(s => s.Hours).Sum();
    }

    public double GetOfferedHoursForWeek(Week week)
    {
        return Staffings
            .Where(s => s.Year == week.Year && s.Week == week.WeekNumber && s.Project.State.Equals(ProjectState.Offer))
            .Select(s => s.Hours).Sum();
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
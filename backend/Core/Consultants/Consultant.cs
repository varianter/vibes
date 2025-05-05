using System.ComponentModel.DataAnnotations.Schema;
using Core.Consultants.Competences;
using Core.Consultants.Disciplines;
using Core.Engagements;
using Core.Forecasts;
using Core.Organizations;
using Core.PlannedAbsences;
using Core.Staffings;
using Core.Vacations;

namespace Core.Consultants;

public class Consultant
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }

    public required string Name { get; set; }
    public required string Email { get; set; }

    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }

    public required Department Department { get; set; }

    public Degree? Degree { get; set; }
    public int GraduationYear { get; set; }
    public int TransferredVacationDays { get; set; }

    public List<CompetenceConsultant> CompetenceConsultant { get; set; } = [];
    public List<Vacation> Vacations { get; set; } = [];
    public List<PlannedAbsence> PlannedAbsences { get; set; } = [];
    public List<Engagement> Projects { get; set; } = [];
    public List<Staffing> Staffings { get; set; } = [];
    public List<Forecast> Forecasts { get; set; } = [];

    public Discipline? Discipline { get; set; }
    public string? DisciplineId { get; set; }
    
    public int? EstimatedHourPrice { get; set; }


    public int YearsOfExperience
    {
        get
        {
            var currentDate = DateOnly.FromDateTime(DateTime.Now);
            var graduationDate = new DateOnly(GraduationYear, 8, 1);
            var yearDifference = currentDate.Year - graduationDate.Year;

            if (currentDate.Month < graduationDate.Month ||
                (currentDate.Month == graduationDate.Month && currentDate.Day < graduationDate.Day)) yearDifference--;
            // Check if < 0 because the consultant has not yet graduated (before 1.August the same year as graduation), the years of experience is 0
            return yearDifference < 0 ? 0 : yearDifference;
        }
    }

    public int TotalAvailableVacationDays => Department.Organization.NumberOfVacationDaysInYear;

    public int GetUsedVacationDays(DateOnly day)
    {
        return Vacations.Where(v => v.Date.Year.Equals(day.Year)).Count(v => v.Date < day);
    }

    public int GetPlannedVacationDays(DateOnly day)
    {
        return Vacations.Where(v => v.Date.Year.Equals(day.Year)).Count(v => v.Date >= day);
    }

    public int GetRemainingVacationDays(DateOnly day)
    {
        return TotalAvailableVacationDays + TransferredVacationDays - GetUsedVacationDays(day) -
               GetPlannedVacationDays(day);
    }
}

public enum Degree
{
    Master,
    Bachelor,
    None
}
using System.ComponentModel.DataAnnotations.Schema;

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

    public List<Engagement> Projects { get; set; } = new();

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
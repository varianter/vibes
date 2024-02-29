using System.ComponentModel.DataAnnotations;
using Core.DomainModels;

namespace Api.Consultants;

public record SingleConsultantReadModel(
    [property: Required] int Id,
    [property: Required] string Name,
    [property: Required] string Email,
    [property: Required] DateOnly? StartDate,
    [property: Required] DateOnly? EndDate,
    [property: Required] List<CompetenceReadModel> Competences,
    [property: Required] string Department,
    [property: Required] int? GraduationYear,
    [property: Required] int YearsOfExperience,
    [property: Required] Degree Degree)

{
    public SingleConsultantReadModel(Consultant consultant)
        : this(
            consultant.Id,
            consultant.Name,
            consultant.Email,
            consultant.StartDate,
            consultant.EndDate,
            consultant.CompetenceConsultant.Select(cc => new CompetenceReadModel(cc.Competence.Id, cc.Competence.Name)).ToList(),
            consultant.Department.Name,
            consultant.GraduationYear,
            consultant.YearsOfExperience,
            consultant.Degree ?? Degree.Master
        )
    {
    }
}

public record CompetenceReadModel(
    [property: Required] string Id,
    [property: Required] string Name)
{
    public CompetenceReadModel(Competence competence)
        : this(
            competence.Id,
            competence.Name
        )
    {
    }
}

public record ConsultantsEmploymentReadModel(
    [property: Required] string Email,
    [property: Required] DateOnly? StartDate,
    [property: Required] DateOnly? EndDate)
{
    public ConsultantsEmploymentReadModel(Consultant consultant)
        : this(
            consultant.Email,
            consultant.StartDate,
            consultant.EndDate
        )
    {
    }
}
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Api.Organisation;
using Core.DomainModels;

namespace Api.Consultants;

public record SingleConsultantReadModel(
    [property: Required] int Id,
    [property: Required] string Name,
    [property: Required] string Email,
    [property: Required] DateOnly? StartDate,
    [property: Required] DateOnly? EndDate,
    [property: Required] List<CompetenceReadModel> Competences,
    [property: Required] UpdateDepartmentReadModel Department,
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
            consultant.CompetenceConsultant
            .Where(cc => cc != null && cc.Competence != null)
            .Select(cc => new CompetenceReadModel(cc.Competence.Id, cc.Competence.Name))
            .ToList(),
            new UpdateDepartmentReadModel(consultant.Department.Id, consultant.Department.Name),
            consultant.GraduationYear,
            consultant.YearsOfExperience,
            consultant.Degree ?? Degree.Master
        )
    {
    }
}

public record CompetenceReadModel(
    string Id,
    string Name);

public record UpdateDepartmentReadModel(
    string Id,
    string Name);

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

public record ConsultantWriteModel(int? Id,
    string Name,
    string Email,
    DateOnly? StartDate,
    DateOnly? EndDate,
    List<CompetenceReadModel>? Competences,
    UpdateDepartmentReadModel Department,
    int GraduationYear,
    int YearsOfExperience,
    Degree Degree);



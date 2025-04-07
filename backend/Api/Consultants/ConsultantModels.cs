using System.ComponentModel.DataAnnotations;
using Api.Common.Types;
using Core.Consultants;

// ReSharper disable NotAccessedPositionalProperty.Global

namespace Api.Consultants;

public record SingleConsultantReadModel(
    int Id,
    string Name,
    string Email,
    DateOnly? StartDate,
    DateOnly? EndDate,
    List<CompetenceReadModel> Competences,
    UpdateDepartmentReadModel Department,
    int? GraduationYear,
    int YearsOfExperience,
    Degree Degree,
    DisciplineReadModel? Discipline)
{
    public SingleConsultantReadModel(Consultant consultant)
        : this(
            consultant.Id,
            consultant.Name,
            consultant.Email,
            consultant.StartDate,
            consultant.EndDate,
            consultant.CompetenceConsultant
                .Select(cc => new CompetenceReadModel(cc.Competence.Id, cc.Competence.Name))
                .ToList(),
            new UpdateDepartmentReadModel(consultant.Department.Id, consultant.Department.Name),
            consultant.GraduationYear,
            consultant.YearsOfExperience,
            consultant.Degree ?? Degree.Master,
            consultant.Discipline is null
                ? null
                : new DisciplineReadModel(consultant.Discipline.Id, consultant.Discipline.Name)
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

public record ConsultantWriteModel(
    int? Id,
    string Name,
    string Email,
    DateTime? StartDate,
    DateTime? EndDate,
    List<CompetenceReadModel>? Competences,
    UpdateDepartmentReadModel Department,
    int GraduationYear,
    Degree Degree);
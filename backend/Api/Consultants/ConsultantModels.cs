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
    DisciplineReadModel? Discipline,
    int EstimatedHourPrice)
{
    public SingleConsultantReadModel(Consultant consultant)
        : this(
            consultant.Id,
            consultant.Name,
            consultant.Email,
            consultant.StartDate,
            consultant.EndDate,
            CompetenceReadModel.CreateSeveral(consultant.CompetenceConsultant),
            UpdateDepartmentReadModel.Create(consultant.Department),
            consultant.GraduationYear,
            consultant.YearsOfExperience,
            consultant.Degree ?? Degree.Master,
            DisciplineReadModel.CreateIfExists(consultant.Discipline),
            consultant.EstimatedHourPrice
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
    Degree Degree,
    DisciplineReadModel? Discipline,
    int EstimatedHourPrice);

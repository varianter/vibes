using System.ComponentModel.DataAnnotations;
using Core.DomainModels;

namespace Api.Consultants;

public record SingleConsultantReadModel([property: Required] int Id,
    [property: Required] string Name,
    [property: Required] string Email,
    [property: Required] List<string> Competences,
    [property: Required] string Department,
    [property: Required] int YearsOfExperience,
    [property: Required] Degree Degree)

{
    public SingleConsultantReadModel(Consultant consultant)
        : this(
            consultant.Id,
            consultant.Name,
            consultant.Email,
            consultant.Competences.Select(c => c.Name).ToList(),
            consultant.Department.Name,
            consultant.YearsOfExperience,
            consultant.Degree ?? Degree.Master
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
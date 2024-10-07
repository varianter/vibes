using System.ComponentModel.DataAnnotations;
using Core.DomainModels;

namespace Api.Projects;

public record EngagementPerCustomerReadModel(
    [property: Required] int CustomerId,
    [property: Required] string CustomerName,
    [property: Required] List<EngagementReadModel> Engagements);

public record EngagementReadModel(
    [property: Required] int EngagementId,
    [property: Required] string EngagementName,
    [property: Required] EngagementState BookingType,
    [property: Required] bool IsBillable);

public record EngagementWriteModel(
    EngagementState BookingType,
    bool IsBillable,
    string ProjectName,
    string CustomerName);

public record ProjectWithCustomerModel(
    string ProjectName,
    string CustomerName,
    EngagementState BookingType,
    bool IsBillable,
    int ProjectId)
{
    public ProjectWithCustomerModel(Engagement engagement) : this(engagement.Name, engagement.Customer.Name,
        engagement.State, engagement.IsBillable, engagement.Id)
    {
    }
}

public record UpdateProjectWriteModel(
    int EngagementId,
    EngagementState ProjectState,
    int StartYear,
    int StartWeek,
    int WeekSpan);

public record UpdateEngagementNameWriteModel(int EngagementId, string EngagementName);

public record CustomersWithProjectsReadModel(
    [property: Required] int CustomerId,
    [property: Required] string CustomerName,
    [property: Required] List<EngagementReadModel> ActiveEngagements,
    [property: Required] List<EngagementReadModel> InactiveEngagements);
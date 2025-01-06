using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;
using Core.Customers;
using Core.Engagements;

namespace Api.Projects;

public record EngagementPerCustomerReadModel(
    int CustomerId,
    string CustomerName,
    bool IsActive,
    List<EngagementReadModel> Engagements);



public record EngagementReadModel(
    int EngagementId,
    string EngagementName,
    EngagementState BookingType,
    bool IsBillable);

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
    int CustomerId,
    string CustomerName,
    bool IsActive,
    List<EngagementReadModel> ActiveEngagements,
    List<EngagementReadModel> InactiveEngagements);
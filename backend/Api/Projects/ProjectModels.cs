using System.ComponentModel.DataAnnotations;
using Api.StaffingController;
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

public record EngagementWriteModel(EngagementState BookingType,
    bool IsBillable, string ProjectName, string CustomerName);

public record ProjectWithCustomerModel(
    [property: Required] string ProjectName,
    [property: Required] string CustomerName,
    [property: Required] EngagementState BookingType,
    [property: Required] bool IsBillable,
    [property: Required] int ProjectId);

public record UpdateProjectWriteModel(int EngagementId, EngagementState ProjectState, int StartYear, int StartWeek,
    int WeekSpan);

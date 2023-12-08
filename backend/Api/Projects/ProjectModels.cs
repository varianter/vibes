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

public record EngagementWriteModel(List<int> ConsultantIds, EngagementState BookingType,
    bool IsBillable, string ProjectName, string CustomerName);

public record ProjectWithCustomerModel(
    [property: Required] string ProjectName,
    [property: Required] string CustomerName,
    [property: Required] EngagementState BookingType,
    [property: Required] bool IsBillable);
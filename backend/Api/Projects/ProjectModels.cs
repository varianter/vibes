using Api.StaffingController;
using Core.DomainModels;

namespace Api.Projects;

public record EngagementPerCustomerReadModel(int CustomerId, string CustomerName,
    List<EngagementReadModel> Engagements);

public record EngagementReadModel(int EngagementId, string EngagementName, ProjectState BookingType, bool IsBillable);

public record EngagementWriteModel(List<int> ConsultantIds, ProjectState BookingType,
    bool IsBillable, string ProjectName, string CustomerName);

public record ProjectWithConsultantsReadModel(string ProjectName, string CustomerName, ProjectState BookingType,
    List<ConsultantReadModel> Consultants, bool IsBillable);
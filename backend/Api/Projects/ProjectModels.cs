using Core.DomainModels;

namespace Api.Projects;

public record EngagementPerCustomerReadModel(int CustomerId, string CustomerName,
    List<EngagementReadModel> Engagements);

public record EngagementReadModel(int EngagementId, string EngagementName, ProjectState ProjectState, bool IsBillable);

public record EngagementWriteModel(List<int> ConsultantIds, ProjectState ProjectState,
    bool IsBillable, string ProjectName, string CustomerName);

public record ProjectWithCustomerModel(string ProjectName, string CustomerName, ProjectState ProjectState, bool IsBillable);
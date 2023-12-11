using Core.DomainModels;

namespace Api.Projects;

public record EngagementPerCustomerReadModel(int CustomerId, string CustomerName,
    List<EngagementReadModel> Engagements);

public record EngagementReadModel(int EngagementId, string EngagementName, EngagementState ProjectState,
    bool IsBillable);

public record EngagementWriteModel(EngagementState ProjectState,
    bool IsBillable, string ProjectName, string CustomerName);

public record ProjectWithCustomerModel(string ProjectName, string CustomerName, EngagementState ProjectState,
    bool IsBillable, int ProjectId);

public record UpdateProjectWriteModel(int EngagementId, EngagementState ProjectState, int StartYear, int StartWeek,
    int WeekSpan);
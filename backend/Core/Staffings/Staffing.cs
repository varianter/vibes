using Core.Consultants;
using Core.DomainModels;
using Core.Engagements;

namespace Core.Staffings;

public class Staffing
{
    public required int EngagementId { get; set; }

    public required Engagement Engagement { get; set; } = null!;

    public required int ConsultantId { get; set; }

    public required Consultant Consultant { get; set; } = null!;

    public required Week Week { get; set; }

    public required double Hours { get; set; } = 0;

    public StaffingKey StaffingKey => new(EngagementId, ConsultantId, Week);
}

public record StaffingKey(int EngagementId, int ConsultantId, Week Week);
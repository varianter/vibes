using System.ComponentModel.DataAnnotations.Schema;

namespace Core.DomainModels;

public class Staffing
{
    public required int ProjectId { get; set; }

    public required Engagement Engagement { get; set; } = null!;
    
    public required int ConsultantId { get; set; }

    public required Consultant Consultant { get; set; } = null!;
    
    public required Week Week { get; set; }

    public required double Hours { get; set; } = 0;
    
    public StaffingKey StaffingKey => new(ProjectId, ConsultantId, Week);

}

public record StaffingKey(int ProjectId, int ConsultantId, Week Week);
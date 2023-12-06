using System.ComponentModel.DataAnnotations.Schema;

namespace Core.DomainModels;

public class Engagement
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public required Customer Customer { get; set; }

    public required EngagementState State { get; set; }

    public List<Consultant> Consultants { get; set; } = new();

    public required List<Staffing> Staffings { get; set; } = new();

    public required string Name { get; set; }
    
    public required bool IsBillable { get; set; }

}

public enum EngagementState
{
    Closed,
    Order,
    Lost,
    Offer,
    Active
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.DomainModels;

public class Project
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public required Customer Customer { get; set; }

    public required ProjectState State { get; set; }

    public List<Consultant> Consultants { get; set; } = new();

    public required List<Staffing> Staffings { get; set; } = new();

    public required string Name { get; set; }

    public required bool IsBillable { get; set; }
}

public enum ProjectState
{
    Closed,
    Order,
    Lost,
    Offer,
    Active
}
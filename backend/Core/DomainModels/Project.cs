using System.ComponentModel.DataAnnotations.Schema;

namespace Core.DomainModels;

public class Project
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required int Id { get; set; }

    public required Customer Customer { get; set; }

    public required ProjectState State { get; set; }

    public List<Consultant> Consultants { get; set; } = new();

    public required List<Staffing> Staffings { get; set; } = new();

    public required string Name { get; set; }

    //public required bool IsBillable { get; set; }
}

public enum ProjectState
{
    Closed,
    Order,
    Lost,
    Offer,
    Active
}
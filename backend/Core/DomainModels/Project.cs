using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Core.DomainModels;

public class Project
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required int Id { get; set; }

    public required Client Client { get; set; }

    public required ProjectState State { get; set; }

    public required List<Staffing> Staffings { get; set; }

    // Faktureringsgrad
    public required bool ExcludeFromBillRate { get; set; }

    public required bool InternalProject { get; set; }

    public required string Name { get; set; }

    // public required bool IsVacation { get; set; } //Todo: decide if we need this. Overlaps with vacation-set. Update: We don't
}

public enum ProjectState
{
    Closed,
    Order,
    Lost,
    Offer,
    Active
}
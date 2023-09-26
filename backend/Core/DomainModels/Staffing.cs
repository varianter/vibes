using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Core.DomainModels;

public class Staffing
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public required Project Project { get; set; } = null!;

    public required Consultant Consultant { get; set; } = null!;

    public required int Year { get; set; }

    public required int Week { get; set; }

    public required double Hours { get; set; } = 0;
}
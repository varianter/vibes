using System.ComponentModel.DataAnnotations.Schema;

namespace Core.DomainModels;

public class Absence
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required int Id { get; set; }

    public required string Name { get; set; }
    public required bool ExcludeFromBillRate { get; set; } = false;
}
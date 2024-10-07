using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Absence;

public class Absence
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required int Id { get; set; }

    public required string Name { get; set; }
    public required bool ExcludeFromBillRate { get; set; } = false;
    public required Organization.Organization Organization { get; set; }
}
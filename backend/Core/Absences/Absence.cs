using System.ComponentModel.DataAnnotations.Schema;
using Core.Organizations;

namespace Core.Absences;

public class Absence
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required int Id { get; set; }

    public required string Name { get; set; }
    public required bool ExcludeFromBillRate { get; set; } = false;
    public required Organization Organization { get; set; }
}
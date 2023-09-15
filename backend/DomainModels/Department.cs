using System.ComponentModel.DataAnnotations.Schema;

namespace backend.DomainModels;

public class Department
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required string Id { get; set; }

    public required Organization Organization { get; set; }
    public required string Name { get; set; }
    public required List<Consultant> Consultants { get; set; }
}
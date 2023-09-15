using System.ComponentModel.DataAnnotations.Schema;

namespace backend.DomainModels;

public class Department
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required int Id { get; set; }

    public required Organization Organization { get; set; }
    public required string Name { get; set; }
    public required List<Consultant> Variants { get; set; }
}
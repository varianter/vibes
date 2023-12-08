using System.ComponentModel.DataAnnotations.Schema;

namespace Core.DomainModels;

public class Customer
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public required string Name { get; set; }
    public required Organization Organization { get; set; }
    public required List<Engagement> Projects { get; set; }
}
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Core.DomainModels;

public class Client
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public required string Name { get; set; }

    public required Organization Organization { get; set; }

    public required List<Project> Projects { get; set; }
}
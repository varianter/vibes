using System.ComponentModel.DataAnnotations.Schema;

namespace backend.DomainModels;

public class Organization
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required int Id { get; set; }

    public required string Name { get; set; }
    public required float HoursPerWorkday { get; set; }

    public List<Department> Departments { get; set; }
}
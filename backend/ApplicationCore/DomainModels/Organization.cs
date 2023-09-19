using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.ApplicationCore.DomainModels;

public class Organization
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required string Id { get; set; }

    public required string Name { get; set; }
    public required float HoursPerWorkday { get; set; }

    [JsonIgnore] public List<Department> Departments { get; set; }
}
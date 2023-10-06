using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Core.DomainModels;

public class Department
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required string Id { get; set; }
    public required string Name { get; set; }
    [JsonIgnore] public required List<Consultant> Consultants { get; set; }
}
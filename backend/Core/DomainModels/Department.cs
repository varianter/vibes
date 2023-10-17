using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Core.DomainModels;

public class Department
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required string Id { get; set; }
    public required string Name { get; set; }
    public int Hotkey { get; set; }
    public required Organization Organization { get; set; }
    [JsonIgnore] public required List<Consultant> Consultants { get; set; }
}
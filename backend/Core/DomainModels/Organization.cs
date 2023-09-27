using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Core.DomainModels;

public class Organization
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required string Id { get; set; }

    public required string Name { get; set; }
    public required double HoursPerWorkday { get; set; }

    [JsonIgnore] public List<Department> Departments { get; set; }

    public required List<Customer> Customers { get; set; }

    public List<Absence> AbsenceTypes { get; set; }
}
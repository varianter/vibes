using System.Text.Json.Serialization;

namespace Core.DomainModels;

public class Organization
{
    public required string Id { get; set; } // guid ? Decide What to set here first => 
    public required string Name { get; set; }
    public required string UrlKey { get; set; } // "variant-as", "variant-sverige"
    public required string Country { get; set; }
    public required int NumberOfVacationDaysInYear { get; set; }
    public required bool HasVacationInChristmas { get; set; }
    public required double HoursPerWorkday { get; set; }

    [JsonIgnore] public List<Department> Departments { get; set; }

    public required List<Customer> Customers { get; set; }

    public List<Absence> AbsenceTypes { get; set; }
}
using System.ComponentModel.DataAnnotations.Schema;
using Core.Agreements;
using Core.Engagements;
using Core.Organizations;

// ReSharper disable EntityFramework.ModelValidation.UnlimitedStringLength
// ReSharper disable CollectionNeverUpdated.Global

namespace Core.Customers;

public class Customer
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }
    public required string Name { get; set; }

    public ICollection<Agreement> Agreements { get; init; } = new List<Agreement>();
    public required List<Engagement> Projects { get; init; }

    public required string OrganizationId { get; init; }
    public required Organization Organization { get; init; }
}
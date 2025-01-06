using System.ComponentModel;
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
    public required Organization Organization { get; set; }
    public required List<Engagement> Projects { get; set; }

    public bool IsActive { get; set; } = true;

}
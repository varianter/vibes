using System.ComponentModel.DataAnnotations.Schema;
using Core.Engagements;
using Core.Organizations;

namespace Core.Customers;

public class Customer
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string? OrganizationId { get; set; }

    public required string Name { get; set; }
    public required Organization Organization { get; set; }
    public required List<Engagement> Projects { get; set; }
}
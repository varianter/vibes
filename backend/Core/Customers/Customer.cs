using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Agreements;
using Core.Engagements;
using Core.Organizations;

namespace Core.Customers;

public class Customer
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string? OrganizationId { get; set; }
    public ICollection<Agreement> Agreements { get; set; } = new List<Agreement>();
    public required string Name { get; set; }
    public required Organization Organization { get; set; }
    public required List<Engagement> Projects { get; set; }

    public bool IsActive { get; set; } = true;

}
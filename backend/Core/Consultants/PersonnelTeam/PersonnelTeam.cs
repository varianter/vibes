using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Core.Consultants.PersonnelTeam;

[Index(nameof(LeaderId), IsUnique = true)]
public class PersonnelTeam
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; init; }
    public required int LeaderId { get; init; }
    public required string OrganizationUrlKey { get; init; }
}
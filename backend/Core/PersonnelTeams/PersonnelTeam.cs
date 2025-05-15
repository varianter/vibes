using System.ComponentModel.DataAnnotations.Schema;
using Core.Consultants;

namespace Core.PersonnelTeams;

public class PersonnelTeam
{
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public required int Id { get; init; }

	public required string OrganizationUrlKey { get; init; }

	public required int LeaderId { get; init; }
	public required Consultant Leader { get; set; }

	public List<Consultant> Members { get; set; } = [];
}

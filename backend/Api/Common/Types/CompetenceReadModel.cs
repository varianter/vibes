using Core.Consultants.Competences;

namespace Api.Common.Types;

public record CompetenceReadModel(string Id, string Name)
{
	public static List<CompetenceReadModel> CreateSeveral(IEnumerable<CompetenceConsultant> competenceConsultantEntries)
	{
		return competenceConsultantEntries
			.Select(entry => new CompetenceReadModel(entry.Competence.Id, entry.Competence.Name))
			.ToList();
	}
}

using Core.Consultants.Competences;

namespace Api.Common.Types;

public record CompetenceReadModel(string Id, string Name)
{
	public CompetenceReadModel(Competence competence) : this(competence.Id, competence.Name)
	{
	}
}

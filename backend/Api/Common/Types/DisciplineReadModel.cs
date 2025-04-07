using Core.Consultants.Disciplines;

namespace Api.Common.Types;

public record DisciplineReadModel(string Id, string Name)
{
	public static DisciplineReadModel? CreateIfExists(Discipline? discipline)
	{
		return discipline is null
			? null
			: new DisciplineReadModel(discipline.Id, discipline.Name);
	}
}

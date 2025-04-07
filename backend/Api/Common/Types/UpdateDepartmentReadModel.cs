using Core.Organizations;

namespace Api.Common.Types;

public record UpdateDepartmentReadModel(string Id, string Name)
{
	public static UpdateDepartmentReadModel Create(Department department)
	{
		return new UpdateDepartmentReadModel(department.Id, department.Name);
	}
}

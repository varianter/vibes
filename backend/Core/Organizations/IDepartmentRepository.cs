namespace Core.Organizations;

public interface IDepartmentRepository
{
    public Task<List<Department>> GetDepartmentsInOrganizationByUrlKey(string orgUrlKey,
        CancellationToken cancellationToken);
}
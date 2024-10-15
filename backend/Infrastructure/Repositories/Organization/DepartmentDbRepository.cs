using Core.Organizations;
using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Organization;

public class DepartmentDbRepository(ApplicationContext context) : IDepartmentRepository
{
    public async Task<List<Department>> GetDepartmentsInOrganizationByUrlKey(string orgUrlKey,
        CancellationToken cancellationToken)
    {
        var organizationId = context.Organization.FirstOrDefault(o => o.UrlKey == orgUrlKey)?.Id;
        if (organizationId is null) return [];

        return await context.Department.Where(d => d.Organization.Id == organizationId).ToListAsync(cancellationToken);
    }
}
using Core.Organizations;
using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Organization;

public class OrganisationDbRepository(ApplicationContext context) : IOrganisationRepository
{
    public Task<Core.Organizations.Organization?> GetOrganizationByUrlKey(string urlKey,
        CancellationToken cancellationToken)
    {
        return context.Organization
            .SingleOrDefaultAsync(organization => organization.UrlKey == urlKey, cancellationToken);
    }
}
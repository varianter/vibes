using Core.DomainModels;
using Core.IRepositories;
using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class OrganisationDbRepository(ApplicationContext context) : IOrganisationRepository
{
    public Task<Organization?> GetOrganizationByUrlKey(string urlKey, CancellationToken cancellationToken)
    {
        return context.Organization
            .AsNoTracking()
            .SingleOrDefaultAsync(organization => organization.UrlKey == urlKey, cancellationToken);
    }
}
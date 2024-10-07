using Core.DomainModels;
using Core.IRepositories;
using Database.DatabaseContext;

namespace Database.Repositories;

public class OrganisationDbRepository : IOrganisationRepository
{
    private readonly ApplicationContext _context;

    public OrganisationDbRepository(ApplicationContext context)
    {
        _context = context;
    }

    public Organization? GetOrganizationByUrlKey(string urlKey)
    {
        return _context.Organization.SingleOrDefault(organization => organization.UrlKey == urlKey);
    }
}
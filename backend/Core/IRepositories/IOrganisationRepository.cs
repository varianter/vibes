using Core.DomainModels;

namespace Core.IRepositories;

public interface IOrganisationRepository
{
    public Task<Organization?> GetOrganizationByUrlKey(string urlKey, CancellationToken cancellationToken);
}
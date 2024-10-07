using Core.DomainModels;

namespace Core.IRepositories;

public interface IOrganisationRepository
{
    public Organization? GetOrganizationByUrlKey(string urlKey);
}
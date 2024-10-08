namespace Core.Organizations;

public interface IOrganisationRepository
{
    public Task<Organization?> GetOrganizationByUrlKey(string urlKey, CancellationToken cancellationToken);
}
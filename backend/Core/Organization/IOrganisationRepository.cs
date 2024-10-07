namespace Core.Organization;

public interface IOrganisationRepository
{
    public Task<Organization?> GetOrganizationByUrlKey(string urlKey, CancellationToken cancellationToken);
}
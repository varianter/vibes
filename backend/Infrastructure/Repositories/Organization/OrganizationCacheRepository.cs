using Core.Organizations;
using Microsoft.Extensions.Caching.Memory;

namespace Infrastructure.Repositories.Organization;

public class OrganizationCacheRepository(IOrganisationRepository sourceRepository, IMemoryCache cache)
    : IOrganisationRepository
{
    private const string CacheKey = "orgCacheKey";

    public async Task<Core.Organizations.Organization?> GetOrganizationByUrlKey(string urlKey,
        CancellationToken cancellationToken)
    {
        if (cache.TryGetValue<Core.Organizations.Organization>($"{CacheKey}/{urlKey}", out var organization))
            if (organization is not null)
                return organization;

        organization = await sourceRepository.GetOrganizationByUrlKey(urlKey, cancellationToken);
        cache.Set($"{CacheKey}/{urlKey}", organization);

        return organization;
    }
}
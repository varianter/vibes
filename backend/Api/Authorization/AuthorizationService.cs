using Api.Cache;
using Core.DomainModels;
using Database.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Api.Authorization;

public class AuthorizationService
{
    private readonly IMemoryCache _cache;
    private readonly ApplicationContext _context;

    public AuthorizationService(IMemoryCache cache, ApplicationContext context)
    {
        _cache = cache;
        _context = context;
    }

    public List<Organization> GetAuthorizedOrganizations(string userEmail)
    {
        var foundCache = _cache.TryGetValue<Dictionary<string, List<Organization>>>(
            CacheKeys.OrganisationsPrConsultant,
            out var consultantOrgMap);

        if (!foundCache || consultantOrgMap is null)
            consultantOrgMap = _context.Consultant
                .Include(c => c.Department)
                .ThenInclude(d => d.Organization)
                .ToDictionary(
                    c => c.Email,
                    consultant => new List<Organization>
                        {
                            consultant.Department.Organization
                        }
                );

        _cache.Set(CacheKeys.OrganisationsPrConsultant, consultantOrgMap);
        return consultantOrgMap.TryGetValue(userEmail, out var orgList) ? orgList : new List<Organization>();
    }

    public bool IsInOrganisation(string userEmail, string orgId)
    {
        return GetAuthorizedOrganizations(userEmail).Any(org => org.Id == orgId);
    }
}
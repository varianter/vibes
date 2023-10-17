using Core.DomainModels;
using Database.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Api.Authorization;

public class AuthorizationService
{
    private IMemoryCache _cache;
    private ApplicationContext _context;

    public AuthorizationService(IMemoryCache cache, ApplicationContext context)
    {
        _cache = cache;
        _context = context;
    }

    public List<Organization> GetAuthorizedOrganizations(string userEmail)
    {

        return _context.Organization
            .Include(org => org.Departments)
            .ThenInclude(dept => dept.Consultants)
            .Where(org => org.Departments
                .Count(dept => dept.Consultants.Select(c => c.Email).Contains(userEmail)) > 0)
            .ToList();
    }

    public bool IsInOrganisation(string userEmail, string orgId){
        return GetAuthorizedOrganizations(userEmail).Any(org => org.Id == orgId);
    }
}
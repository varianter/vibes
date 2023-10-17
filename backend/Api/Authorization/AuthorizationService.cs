using Core.DomainModels;
using Database.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace Api.Authorization;

public static class AuthorizationService
{
    public static List<Organization> GetAuthorizedOrganizations(ApplicationContext dbContext, HttpContext httpContext)
    {
        var uname = httpContext.User.Claims.Single(c => c.Type == "preferred_username").Value;

        return dbContext.Organization
            .Include(org => org.Departments)
            .ThenInclude(dept => dept.Consultants)
            .Where(org => org.Departments
                .Count(dept => dept.Consultants.Select(c => c.Email).Contains(uname)) > 0)
            .ToList();
    }
}
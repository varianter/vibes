using Database.DatabaseContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Authorization;

[Route("v0/authorization")]
[ApiController]
public class AuthorizationController : ControllerBase
{
    [HttpGet]
    public ActionResult<List<OrganizationReadModel>> Get(ApplicationContext context)
    {
        var uname = HttpContext.User.Claims.Single(c => c.Type == "preferred_username").Value;

        var orgs = context.Organization
            .Include(org => org.Departments)
            .ThenInclude(dept => dept.Consultants)
            .Where(org => org.Departments
                .Count(dept => dept.Consultants.Select(c => c.Email).Contains(uname)) > 0)
            .Select(organization =>
                new OrganizationReadModel(organization.Id, organization.UrlKey, organization.Name))
            .ToList();

        return Ok(orgs);
    }
}
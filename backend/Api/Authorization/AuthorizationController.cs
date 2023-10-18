using Microsoft.AspNetCore.Mvc;

namespace Api.Authorization;

[Route("v0/authorization")]
[ApiController]
public class AuthorizationController : ControllerBase
{
    [HttpGet]
    public ActionResult<List<OrganizationReadModel>> Get(AuthorizationService authorizationService)
    {
        var email = HttpContext.User.Claims.Single(c => c.Type == "preferred_username").Value;
        return Ok(authorizationService.GetAuthorizedOrganizations(email)
            .Select(org => new OrganizationReadModel(org.Id, org.UrlKey, org.Name)));
    }
}
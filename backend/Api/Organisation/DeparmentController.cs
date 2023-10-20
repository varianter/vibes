using Database.DatabaseContext;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Organisation;

[Route("/v0/organisations")]
[ApiController]
public class OrganisationController : ControllerBase
{
    private readonly ApplicationContext _applicationContext;

    public OrganisationController(ApplicationContext applicationContext)
    {
        _applicationContext = applicationContext;
    }

    [HttpGet]
    public ActionResult<List<OrganisationReadModel>> Get()
    {
        return _applicationContext.Organization
            .Select(organization => new OrganisationReadModel(organization.Name, organization.UrlKey))
            .ToList();
    }


    [HttpGet]
    [Route("{orgUrlKey}/departments")]
    public ActionResult<List<DepartmentReadModel>> GetDepartment([FromRoute] string orgUrlKey)
    {
        return _applicationContext.Organization
            .Include(o => o.Departments)
            .Single(o => o.UrlKey == orgUrlKey)
            .Departments
            .Select(d => new DepartmentReadModel(d.Id, d.Name, d.Hotkey))
            .ToList();
    }
}

public record DepartmentReadModel(string Id, string Name, int? Hotkey);

public record OrganisationReadModel(string Name, string UrlKey);
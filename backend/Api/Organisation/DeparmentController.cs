using System.ComponentModel.DataAnnotations;
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

    [HttpGet]
    [Route("{orgUrlKey}/weeklyWorkHours")]
    public ActionResult<double> GetWeeklyWorkHours([FromRoute] string orgUrlKey)
    {
        return _applicationContext.Organization
            .Single(o => o.UrlKey == orgUrlKey)
            .HoursPerWorkday * 5;
    }
}

public record DepartmentReadModel([property: Required] string Id, [property: Required] string Name, int? Hotkey);

public record OrganisationReadModel([property: Required] string Name, [property: Required] string UrlKey);
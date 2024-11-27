using Core.Organizations;
using Infrastructure.DatabaseContext;
using Microsoft.AspNetCore.Mvc;

namespace Api.Organisation;

[Route("/v0/organisations")]
[ApiController]
public class OrganisationController(ApplicationContext applicationContext, IDepartmentRepository departmentRepository)
    : ControllerBase
{
    [HttpGet]
    public ActionResult<List<OrganisationReadModel>> Get()
    {
        return applicationContext.Organization
            .Select(organization => new OrganisationReadModel(organization.Name, organization.UrlKey))
            .ToList();
    }


    [HttpGet]
    [Route("{orgUrlKey}/departments")]
    public async Task<ActionResult<List<DepartmentReadModel>>> GetDepartment([FromRoute] string orgUrlKey,
        CancellationToken cancellationToken)
    {
        var departments = await departmentRepository.GetDepartmentsInOrganizationByUrlKey(orgUrlKey, cancellationToken);
        return departments.Select(department => new DepartmentReadModel(department)).ToList();
    }

    [HttpGet]
    [Route("{orgUrlKey}/weeklyWorkHours")]
    public ActionResult<double> GetWeeklyWorkHours([FromRoute] string orgUrlKey)
    {
        return applicationContext.Organization
            .Single(o => o.UrlKey == orgUrlKey)
            .HoursPerWorkday * 5;
    }
}

public record DepartmentReadModel(string Id, string Name, int? Hotkey)
{
    public DepartmentReadModel(Department d) : this(d.Id, d.Name, d.Hotkey)
    {
    }
}

public record OrganisationReadModel(string Name, string UrlKey);
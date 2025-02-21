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
            .Select(org =>
                new OrganisationReadModel(org.Name, org.UrlKey, org.HoursPerWorkday, org.HoursPerWeek))
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
}

public record DepartmentReadModel(string Id, string Name, int? Hotkey)
{
    public DepartmentReadModel(Department d) : this(d.Id, d.Name, d.Hotkey)
    {
    }
}

public record OrganisationReadModel(string Name, string UrlKey, double HoursPerWorkday, double HoursPerWeek);
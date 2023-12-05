using Api.Common;
using Core.DomainModels;
using Database.DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Api.Projects;

[Authorize]
[Route("/v0/{orgUrlKey}/projects")]
[ApiController]
public class ProjectController : ControllerBase
{
    private readonly IMemoryCache _cache;
    private readonly ApplicationContext _context;

    public ProjectController(ApplicationContext context, IMemoryCache cache)
    {
        _context = context;
        _cache = cache;
    }

    [HttpGet]
    public ActionResult<List<EngagementPerCustomerReadModel>> Get(
        [FromRoute] string orgUrlKey)
    {
        var selectedOrgId = _context.Organization.SingleOrDefault(org => org.UrlKey == orgUrlKey);
        if (selectedOrgId is null) return BadRequest();

        return _context.Project.Include(project => project.Customer)
            .Where(project => project.Customer.Organization.UrlKey == orgUrlKey)
            .GroupBy(project => project.Customer)
            .Select(a =>
                new EngagementPerCustomerReadModel(
                    a.Key.Id,
                    a.Key.Name,
                    a.Select(e =>
                        new EngagementReadModel(e.Id, e.Name, e.State, false)).ToList()))
            .ToList();
    }

    [HttpPatch]
    public ActionResult<EngagementWriteModel> Patch([FromRoute] string orgUrlKey, [FromBody] EngagementWriteModel engagementWriteModel)
    {
        var selectedOrgId = _context.Organization.SingleOrDefault(org => org.UrlKey == orgUrlKey);
        var customer = _context.Customer.SingleOrDefault(c => c.Name == engagementWriteModel.CustomerName);
        var engagement = _context.Project.SingleOrDefault(p => p.Name == engagementWriteModel.EngagementName && p.Customer == customer);
        if (selectedOrgId is null || customer is null || engagement is null) return BadRequest();
        
        var service = new StorageService(_cache, _context);
        try
        {
            engagement =  service.UpdateProjectState(engagement, engagementWriteModel, orgUrlKey);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }

        return new EngagementWriteModel(engagement.Id, engagement.Name, engagementWriteModel.CustomerName, engagement.State, false);

    }
}



public record EngagementPerCustomerReadModel(int CustomerId, string CustomerName,
    List<EngagementReadModel> Engagements);

public record EngagementReadModel(int EngagementId, string EngagementName, ProjectState State, bool IsBillable);

public record EngagementWriteModel(int? EngagementId, string EngagementName, string CustomerName, ProjectState State, bool? IsBillable);


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

    [HttpPost]
    public ActionResult<EngagementReadModel> Post([FromRoute] string orgUrlKey,
        [FromBody] EngagementBackendBody body)
    {
        var service = new StorageService(_cache, _context);

        var selectedOrg = _context.Organization.SingleOrDefault(org => org.UrlKey == orgUrlKey);
        if (selectedOrg is null) return BadRequest("Selected org not found");


        var existingCustomer = _context.Customer.SingleOrDefault(c => c.Id == body.CustomerId);
        
        // GET customer => or POST/CREATE customer =>     
    
        var customer = existingCustomer ?? service.CreateCustomer("Nytt kundenavn", selectedOrg);
        var project = _context.Project.SingleOrDefault(p => p.Id == body.EngagementId) ?? service.CreateProject("ProjectName", customer, body);
        
        var consultants = _context.Consultant.Where(c => body.ConsultantIds.Contains(c.Id)).ToList();
        if (!consultants.Any()) return BadRequest("No consultant-ids match in db");

        // Adding consultants to project
        project.Consultants.AddRange(consultants);
        
        var week = Week.FromDateTime(DateTime.Now);
        service.UpdateOrCreateStaffing(
            new StaffingKey(project.Id, consultants.First().Id, week), 37.5, orgUrlKey
        );
        
        // Temp save this
        // customer.Projects.Add(project);
        // _context.SaveChanges();
        
        

        var result = new EngagementReadModel(project.Id, project.Name, project.State, false);

        return Ok(result);
        
    }
}

public record EngagementPerCustomerReadModel(int CustomerId, string CustomerName,
    List<EngagementReadModel> Engagements);

public record EngagementReadModel(int EngagementId, string EngagementName, ProjectState BookingType, bool IsBillable);


public record EngagementBackendBody(int CustomerId, List<int> ConsultantIds, int EngagementId, ProjectState BookingType,
    bool IsBillable);
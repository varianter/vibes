using Api.Common;
using Api.StaffingController;
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
    private const string ConsultantCacheKey = "consultantCacheKey";

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

    [HttpPut]
    public ActionResult<ProjectWithConsultantsReadModel> Put([FromRoute] string orgUrlKey,
        [FromBody] EngagementWriteModel body)
    {
        var service = new StorageService(_cache, _context);

        var selectedOrg = _context.Organization.SingleOrDefault(org => org.UrlKey == orgUrlKey);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        var customer = service.UpdateOrCreateCustomer(selectedOrg, body.CustomerName, orgUrlKey);
        var project = service.UpdateOrCreateProject(customer, body, orgUrlKey);

        var consultants = _context.Consultant.Where(c => body.ConsultantIds.Contains(c.Id)).ToList();
        if (!consultants.Any()) return BadRequest("No consultant-ids match in db");

        // Adding consultants to project
        // TODO : What if consultants exists from before on project?
        project.Consultants.AddRange(consultants);

        var nextWeekSet = FillProjectWeekWithConsultants(consultants, project);

        _context.SaveChanges();
        _cache.Remove($"{ConsultantCacheKey}/{orgUrlKey}");

        var readModels = new ReadModelFactory(service).GetConsultantReadModelsForWeeks(orgUrlKey, nextWeekSet);

        var filteredConsultants = readModels.Where(c => body.ConsultantIds.Contains(c.Id)).ToList();

        var responseModel = new ProjectWithConsultantsReadModel(project.Name, customer.Name, project.State,
            filteredConsultants, project.IsBillable);

        return Ok(responseModel);
    }

    private List<Week> FillProjectWeekWithConsultants(List<Consultant> consultants, Project project)
    {
        var thisWeek = Week.FromDateTime(DateTime.Now);
        var nextWeekSet = thisWeek.GetNextWeeks(8);

        const double emptyHours = 37.5;

        foreach (var consultant in consultants)
        {
            foreach (var week in nextWeekSet)
            {
                var staffing = _context.Staffing
                    .FirstOrDefault(s => s.ProjectId.Equals(project.Id)
                                         && s.ConsultantId.Equals(consultant.Id)
                                         && s.Week.Equals(week));
                if (staffing is null)
                {
                    _context.Add(new Staffing
                    {
                        ProjectId = project.Id,
                        Project = project,
                        ConsultantId = consultant.Id,
                        Consultant = consultant,
                        Week = week,
                        Hours = emptyHours
                    });
                }
                else
                    staffing.Hours = emptyHours;
            }
        }

        return nextWeekSet;
    }
}




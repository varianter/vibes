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
    [Route("updateState")]
    public ActionResult<List<ConsultantReadModel>> Put([FromRoute] string orgUrlKey, [FromBody] UpdateProjectWriteModel projectWriteModel)
    {
        var selectedOrgId = _context.Organization.SingleOrDefault(org => org.UrlKey == orgUrlKey);
        var engagement = _context.Project.Include(p=>p.Consultants).SingleOrDefault(p => p.Id == projectWriteModel.EngagementId);
        if (selectedOrgId is null || engagement is null) return BadRequest();
        
        var service = new StorageService(_cache, _context);
        try
        {
            service.UpdateProjectState(engagement, projectWriteModel, orgUrlKey);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
        
        var selectedWeek = new Week(projectWriteModel.StartYear, projectWriteModel.StartWeek);

        var weekSet = selectedWeek.GetNextWeeks(projectWriteModel.WeekSpan);

        return new ReadModelFactory(service).GetConsultantReadModelForWeeks(engagement.Consultants.Select(c=>c.Id).ToList(), weekSet);

    }


    [HttpPut]
    public ActionResult<ProjectWithCustomerModel> Put([FromRoute] string orgUrlKey,
        [FromBody] EngagementWriteModel body)
    {
        var service = new StorageService(_cache, _context);

        var selectedOrg = _context.Organization.SingleOrDefault(org => org.UrlKey == orgUrlKey);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        var customer = service.UpdateOrCreateCustomer(selectedOrg, body.CustomerName, orgUrlKey);

        var project = _context.Project
            .Include(p => p.Customer)
            .SingleOrDefault(p => p.Customer.Name == body.CustomerName
                                  && p.IsBillable == body.IsBillable
                                  && p.Name == body.ProjectName
                                  && p.State == body.BookingType
            );

        if (project is null)
        {
            project = new Project
            {
                Customer = customer,
                State = body.BookingType,
                Staffings = new List<Staffing>(),
                Consultants = new List<Consultant>(),
                Name = body.ProjectName,
                IsBillable = body.IsBillable
            };
            
            _context.Project.Add(project);
        }

        _context.SaveChanges();
        service.ClearConsultantCache(orgUrlKey);

        var responseModel =
            new ProjectWithCustomerModel(project.Name, customer.Name, project.State, project.IsBillable);

        return Ok(responseModel);
    }
}

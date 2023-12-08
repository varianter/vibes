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

    [HttpDelete]
    public ActionResult Delete(int id)
    {
        var engagement = _context.Project
            .Include(p => p.Customer)
            .Include(p => p.Staffings)
            .Include(p => p.Consultants)
            .SingleOrDefault(p => p.Id == id);
        if (engagement is not null)
        {
            _context.Project.Remove(engagement);
            _context.SaveChanges();
        }

        return Ok();
    }

    [HttpPut]
    [Route("updateState")]
    public ActionResult<List<ConsultantReadModel>> Put([FromRoute] string orgUrlKey,
        [FromBody] UpdateProjectWriteModel projectWriteModel)
    {
        // Merk: Service kommer snart via Dependency Injection, da slipper å lage ny hele tiden
        var service = new StorageService(_cache, _context);

        if (!ProjectControllerValidator.ValidateUpdateProjectWriteModel(projectWriteModel, service, orgUrlKey))
        {
            return BadRequest("Error in data");
        }

        try
        {
            Project engagement;
            if (EngagementHasSoftMatch(projectWriteModel.EngagementId))
            {
                engagement = MergeProjects(projectWriteModel.EngagementId);
            }
            else
            {
                // TODO: Gjerne flytt dette ut i en egen metode også. Kanskje storageservice? 
                engagement = _context.Project
                    .Include(p => p.Consultants)
                    .Include(p => p.Staffings)
                    .Single(p => p.Id == projectWriteModel.EngagementId);

                engagement.State = projectWriteModel.ProjectState;
                _context.SaveChanges();
            }

            var selectedWeek = new Week(projectWriteModel.StartYear, projectWriteModel.StartWeek);
            var weekSet = selectedWeek.GetNextWeeks(projectWriteModel.WeekSpan);

            

            service.ClearConsultantCache(orgUrlKey);

            return new ReadModelFactory(service).GetConsultantReadModelForWeeks(
                engagement.Consultants.Select(c => c.Id).ToList(), weekSet);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    private bool EngagementHasSoftMatch(int id)
    {
        // TODO: Noe usikker på hvor denne metoden skal være. Om du har en bedre idé, gjerne flytt den :) 
        var engagementToChange = _context.Project
            .Include(p => p.Customer)
            .Single(p => p.Id == id);

        return _context.Project
            .SingleOrDefault(
                p => p.Customer == engagementToChange.Customer && p.Name == engagementToChange.Name &&
                     p.Id != id) is not null;
    }

    private Project MergeProjects(int id)
    {
        // TODO: Noe usikker på hvor denne metoden skal være. Om du har en bedre idé, gjerne flytt den :) 
        var engagementToChange = _context.Project
            .Include(p => p.Staffings)
            .Include(p => p.Customer)
            .Single(p => p.Id == id);

        var engagementToKeep = _context.Project
            .Include(p => p.Staffings)
            .Single(
                p =>
                    p.Customer == engagementToChange.Customer
                    // Tror vi også bør sjekke det, så vi unngå å flette med gamle tapte prosjekter o.l.
                    && (p.State == ProjectState.Offer || p.State == ProjectState.Order)
                    && p.Name == engagementToChange.Name
                    && p.Id != id);

        engagementToKeep.MergeEngagement(engagementToChange);
        _context.Remove(engagementToChange);
        _context.SaveChanges();

        return _context.Project
            .Include(p => p.Consultants)
            .Include(p => p.Staffings)
            .Single(p => p.Id == engagementToKeep.Id);
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
                                  && p.State == body.ProjectState
            );

        if (project is null)
        {
            project = new Project
            {
                Customer = customer,
                State = body.ProjectState,
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
            new ProjectWithCustomerModel(project.Name, customer.Name, project.State, project.IsBillable, project.Id);

        return Ok(responseModel);
    }
}
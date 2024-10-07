using Api.Common;
using Api.StaffingController;
using Core.DomainModels;
using Core.Engagement;
using Core.Organization;
using Infrastructure.DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Api.Projects;

[Authorize]
[Route("/v0/{orgUrlKey}/projects")]
[ApiController]
public class ProjectController(
    ApplicationContext context,
    IMemoryCache cache,
    IOrganisationRepository organisationRepository,
    IEngagementRepository engagementRepository) : ControllerBase
{
    private const string AbsenceCustomerName = "Variant - Fravær";

    [HttpGet]
    [Route("get/{projectId}")]
    public async Task<ActionResult<ProjectWithCustomerModel>> GetProject([FromRoute] string orgUrlKey,
        [FromRoute] int projectId, CancellationToken ct)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, ct);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        var engagement = await engagementRepository.GetEngagementById(projectId, ct);

        if (engagement is null) return NotFound();

        var responseModel = new ProjectWithCustomerModel(engagement);
        return Ok(responseModel);
    }

    [HttpGet]
    public ActionResult<List<EngagementPerCustomerReadModel>> Get(
        [FromRoute] string orgUrlKey)
    {
        var selectedOrgId = context.Organization.SingleOrDefault(org => org.UrlKey == orgUrlKey);
        if (selectedOrgId is null) return BadRequest();

        var absenceReadModels = new EngagementPerCustomerReadModel(-1, AbsenceCustomerName,
            context.Absence.Where(a => a.Organization.UrlKey == orgUrlKey).Select(absence =>
                new EngagementReadModel(absence.Id, absence.Name, EngagementState.Absence, false)).ToList());

        var projectReadModels = context.Project.Include(project => project.Customer)
            .Where(project => project.Customer.Organization.UrlKey == orgUrlKey)
            .GroupBy(project => project.Customer)
            .Select(a =>
                new EngagementPerCustomerReadModel(
                    a.Key.Id,
                    a.Key.Name,
                    a.Select(e =>
                        new EngagementReadModel(e.Id, e.Name, e.State, e.IsBillable)).ToList()))
            .ToList();

        projectReadModels.Add(absenceReadModels);
        var sortedProjectReadModels = projectReadModels.OrderBy(project => project.CustomerName).ToList();
        return sortedProjectReadModels;
    }


    [HttpGet]
    [Route("{customerId}")]
    public ActionResult<CustomersWithProjectsReadModel> GetCustomerWithEngagements(
        [FromRoute] string orgUrlKey,
        [FromRoute] int customerId
    )
    {
        var selectedOrgId = context.Organization.SingleOrDefault(org => org.UrlKey == orgUrlKey);
        if (selectedOrgId is null) return BadRequest();

        var thisWeek = Week.FromDateTime(DateTime.Now);

        var service = new StorageService(cache, context);

        if (customerId == -1) //CustomerId == -1 means PlannedAbsences
            return Ok(HandleGetAbsenceWithAbsences(orgUrlKey));

        var customer = service.GetCustomerFromId(orgUrlKey, customerId);

        if (customer is null) return NotFound();


        return new CustomersWithProjectsReadModel(
            customer.Id,
            customer.Name,
            customer.Projects.Where(p =>
                p.Staffings.Any(s => s.Week.CompareTo(thisWeek) >= 0) && p.State != EngagementState.Closed).Select(e =>
                new EngagementReadModel(e.Id, e.Name, e.State, e.IsBillable)).ToList(),
            customer.Projects.Where(p =>
                !p.Staffings.Any(s => s.Week.CompareTo(thisWeek) >= 0) || p.State == EngagementState.Closed).Select(e =>
                new EngagementReadModel(e.Id, e.Name, e.State, e.IsBillable)).ToList());
    }

    [HttpDelete]
    public ActionResult Delete(int id)
    {
        var engagement = context.Project
            .Include(p => p.Customer)
            .Include(p => p.Staffings)
            .Include(p => p.Consultants)
            .SingleOrDefault(p => p.Id == id);
        if (engagement is not null)
        {
            context.Project.Remove(engagement);
            context.SaveChanges();
        }

        return Ok();
    }

    [HttpPut]
    [Route("updateState")]
    public ActionResult<List<StaffingReadModel>> Put([FromRoute] string orgUrlKey,
        [FromBody] UpdateProjectWriteModel projectWriteModel)
    {
        // Merk: Service kommer snart via Dependency Injection, da slipper å lage ny hele tiden
        var service = new StorageService(cache, context);

        if (!ProjectControllerValidator.ValidateUpdateProjectWriteModel(projectWriteModel, service, orgUrlKey))
            return BadRequest("Error in data");

        try
        {
            Engagement engagement;
            if (EngagementHasSoftMatch(projectWriteModel.EngagementId))
            {
                engagement = MergeProjects(projectWriteModel.EngagementId);
            }
            else
            {
                engagement = context.Project
                    .Include(p => p.Consultants)
                    .Include(p => p.Staffings)
                    .Single(p => p.Id == projectWriteModel.EngagementId);

                engagement.State = projectWriteModel.ProjectState;
                context.SaveChanges();
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

    [HttpPut]
    [Route("updateProjectName")]
    public ActionResult<List<EngagementReadModel>> Put([FromRoute] string orgUrlKey,
        [FromBody] UpdateEngagementNameWriteModel engagementWriteModel)
    {
        // Merk: Service kommer snart via Dependency Injection, da slipper å lage ny hele tiden
        var service = new StorageService(cache, context);

        if (!ProjectControllerValidator.ValidateUpdateEngagementNameWriteModel(engagementWriteModel, service,
                orgUrlKey))
            return BadRequest(new ErrorResponseBody("1", "Invalid body"));
        if (ProjectControllerValidator.ValidateUpdateEngagementNameAlreadyExist(engagementWriteModel, service,
                orgUrlKey)) return Conflict(new ErrorResponseBody("1872", "Name already in use"));

        try
        {
            Engagement engagement;
            engagement = context.Project
                .Include(p => p.Consultants)
                .Include(p => p.Staffings)
                .Single(p => p.Id == engagementWriteModel.EngagementId);

            engagement.Name = engagementWriteModel.EngagementName;
            context.SaveChanges();

            service.ClearConsultantCache(orgUrlKey);

            var responseModel =
                new EngagementReadModel(engagement.Id, engagement.Name, engagement.State, engagement.IsBillable);

            return Ok(responseModel);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    private bool EngagementHasSoftMatch(int id)
    {
        var engagementToChange = context.Project
            .Include(p => p.Customer)
            .Single(p => p.Id == id);

        return context.Project
            .SingleOrDefault(
                p => p.Customer == engagementToChange.Customer && p.Name == engagementToChange.Name &&
                     (p.State == EngagementState.Offer ||
                      p.State == EngagementState.Order) && p.IsBillable == engagementToChange.IsBillable &&
                     p.Id != id) is not null;
    }

    private Engagement MergeProjects(int id)
    {
        var engagementToChange = context.Project
            .Include(p => p.Staffings)
            .Include(p => p.Customer)
            .Single(p => p.Id == id);

        var engagementToKeep = context.Project
            .Include(p => p.Staffings)
            .Single(
                p =>
                    p.Customer == engagementToChange.Customer
                    // Tror vi også bør sjekke det, så vi unngå å flette med gamle tapte prosjekter o.l.
                    && (p.State == EngagementState.Offer || p.State == EngagementState.Order)
                    && p.Name == engagementToChange.Name
                    && p.IsBillable == engagementToChange.IsBillable
                    && p.Id != id);

        engagementToKeep.MergeEngagement(engagementToChange);
        context.Remove(engagementToChange);
        context.SaveChanges();

        return context.Project
            .Include(p => p.Consultants)
            .Include(p => p.Staffings)
            .Single(p => p.Id == engagementToKeep.Id);
    }


    [HttpPut]
    public ActionResult<ProjectWithCustomerModel> Put([FromRoute] string orgUrlKey,
        [FromBody] EngagementWriteModel body)
    {
        var service = new StorageService(cache, context);

        var selectedOrg = context.Organization.SingleOrDefault(org => org.UrlKey == orgUrlKey);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        if (body.CustomerName == AbsenceCustomerName)
            return Ok(HandleAbsenceChange(body, orgUrlKey));

        var customer = service.UpdateOrCreateCustomer(selectedOrg, body.CustomerName, orgUrlKey);

        var project = context.Project
            .Include(p => p.Customer)
            .SingleOrDefault(p => p.Customer.Id == customer.Id
                                  && p.Name == body.ProjectName
            );

        if (project is null)
        {
            project = new Engagement
            {
                Customer = customer,
                State = body.BookingType,
                Staffings = new List<Staffing>(),
                Consultants = new List<Consultant>(),
                Name = body.ProjectName,
                IsBillable = body.IsBillable
            };

            context.Project.Add(project);
        }

        context.SaveChanges();
        service.ClearConsultantCache(orgUrlKey);

        var responseModel =
            new ProjectWithCustomerModel(project.Name, customer.Name, project.State, project.IsBillable, project.Id);

        return Ok(responseModel);
    }


    private ProjectWithCustomerModel HandleAbsenceChange(EngagementWriteModel body, string orgUrlKey)
    {
        var absence = context.Absence.Single(a => a.Name == body.ProjectName && a.Organization.UrlKey == orgUrlKey);
        return new ProjectWithCustomerModel(absence.Name, AbsenceCustomerName, EngagementState.Absence, false,
            absence.Id);
    }

    private CustomersWithProjectsReadModel HandleGetAbsenceWithAbsences(string orgUrlKey)
    {
        var vacation = new EngagementReadModel(-1, "Ferie", EngagementState.Absence, false);

        var readModel = new CustomersWithProjectsReadModel(-1, AbsenceCustomerName + " og Ferie",
            context.Absence.Where(a => a.Organization.UrlKey == orgUrlKey).Select(absence =>
                new EngagementReadModel(absence.Id, absence.Name, EngagementState.Absence, false)).ToList(),
            new List<EngagementReadModel>());

        readModel.ActiveEngagements.Add(vacation);
        return readModel;
    }
}
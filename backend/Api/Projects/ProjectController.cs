using Api.Common;
using Api.StaffingController;
using Core.Engagements;
using Core.Organizations;
using Core.Weeks;
using Infrastructure.DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
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
    [Route("get/{projectId:int}")]
    public async Task<ActionResult<ProjectWithCustomerModel>> GetProject([FromRoute] string orgUrlKey,
        [FromRoute] int projectId, CancellationToken cancellationToken)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, cancellationToken);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        var engagement = await engagementRepository.GetEngagementById(projectId, cancellationToken);

        if (engagement is null) return NotFound();

        var responseModel = new ProjectWithCustomerModel(engagement);
        return Ok(responseModel);
    }

    [HttpGet]
    public async Task<ActionResult<List<EngagementPerCustomerReadModel>>> Get(
        [FromRoute] string orgUrlKey, CancellationToken cancellationToken)
    {
        var selectedOrgId = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, cancellationToken);
        if (selectedOrgId is null) return BadRequest();

        var absenceReadModels = new EngagementPerCustomerReadModel(-1, AbsenceCustomerName, true,
            await context.Absence.Where(a => a.Organization.UrlKey == orgUrlKey).Select(absence =>
                    new EngagementReadModel(absence.Id, absence.Name, EngagementState.Absence, false))
                .ToListAsync(cancellationToken));

        var projectReadModels = await context.Project.Include(project => project.Customer)
            .Where(project =>
                project.Customer.Organization.UrlKey == orgUrlKey)
            .GroupBy(project => project.Customer)
            .Select(a =>
                new EngagementPerCustomerReadModel(
                    a.Key.Id,
                    a.Key.Name,
                    a.Key.IsActive,
                    a.Select(e =>
                        new EngagementReadModel(e.Id, e.Name, e.State, e.IsBillable)).ToList()))
            .ToListAsync(cancellationToken);

        projectReadModels.Add(absenceReadModels);
        var sortedProjectReadModels = projectReadModels.OrderBy(project => project.CustomerName).ToList();
        return sortedProjectReadModels;
    }


    [HttpGet]
    [Route("{customerId:int}")]
    public async Task<ActionResult<CustomersWithProjectsReadModel>> GetCustomerWithEngagements(
        [FromRoute] string orgUrlKey,
        [FromRoute] int customerId,
        CancellationToken cancellationToken
    )
    {
        var selectedOrgId = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, cancellationToken);
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
            customer.IsActive,
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
        // Note: Service will be injected with DI soon
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
        // Note: Service will be injected with DI soon
        var service = new StorageService(cache, context);

        if (!ProjectControllerValidator.ValidateUpdateEngagementNameWriteModel(engagementWriteModel, service,
                orgUrlKey))
            return BadRequest(new ErrorResponseBody("1", "Invalid body"));
        if (ProjectControllerValidator.ValidateUpdateEngagementNameAlreadyExist(engagementWriteModel, service,
                orgUrlKey)) return Conflict(new ErrorResponseBody("1872", "Name already in use"));

        try
        {
            var engagement = context.Project
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


    [HttpPut]
    [Route("customer/{customerId}/activate")]
    public async Task<Results<Ok, NotFound<string>>> Put([FromRoute] int customerId, [FromQuery] bool activate,
        string orgUrlKey, CancellationToken ct)
    {
        var service = new StorageService(cache, context);
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, ct);
        if (selectedOrg is null) return TypedResults.NotFound("Selected org not found");
        var customer = service.DeactivateOrActivateCustomer(customerId, selectedOrg, activate, orgUrlKey);
        if (customer is null) return TypedResults.NotFound("Selected customer not found");
        return TypedResults.Ok();
    }

    [HttpPut]
    public async Task<ActionResult<ProjectWithCustomerModel>> Put([FromRoute] string orgUrlKey,
        [FromBody] EngagementWriteModel body, CancellationToken cancellationToken)
    {
        var service = new StorageService(cache, context);

        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, cancellationToken);
        if (selectedOrg is null) return BadRequest("Selected org not found");

        if (body.CustomerName == AbsenceCustomerName)
            return Ok(HandleAbsenceChange(body, orgUrlKey));

        var customer = await service.FindOrCreateCustomer(selectedOrg, body.CustomerName, orgUrlKey, cancellationToken);

        var project = await context.Project
            .Include(p => p.Customer)
            .FirstOrDefaultAsync(p => p.Customer.Id == customer.Id
                                      && p.Name == body.ProjectName, cancellationToken
            );

        if (project is null)
        {
            project = new Engagement
            {
                Customer = customer,
                State = body.BookingType,
                Staffings = [],
                Consultants = [],
                Agreements = [],
                Name = body.ProjectName,
                IsBillable = body.IsBillable
            };

            context.Project.Add(project);
        }

        await context.SaveChangesAsync(cancellationToken);
        service.ClearConsultantCache(orgUrlKey);

        var responseModel =
            new ProjectWithCustomerModel(project.Name, customer.Name, project.State, project.IsBillable, project.Id);

        return Ok(responseModel);
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


    private ProjectWithCustomerModel HandleAbsenceChange(EngagementWriteModel body, string orgUrlKey)
    {
        var absence = context.Absence.Single(a => a.Name == body.ProjectName && a.Organization.UrlKey == orgUrlKey);
        return new ProjectWithCustomerModel(absence.Name, AbsenceCustomerName, EngagementState.Absence, false,
            absence.Id);
    }

    private CustomersWithProjectsReadModel HandleGetAbsenceWithAbsences(string orgUrlKey)
    {
        var vacation = new EngagementReadModel(-1, "Ferie", EngagementState.Absence, false);

        var readModel = new CustomersWithProjectsReadModel(-1, AbsenceCustomerName + " og Ferie", true,
            context.Absence.Where(a => a.Organization.UrlKey == orgUrlKey).Select(absence =>
                new EngagementReadModel(absence.Id, absence.Name, EngagementState.Absence, false)).ToList(),
            new List<EngagementReadModel>());

        readModel.ActiveEngagements.Add(vacation);
        return readModel;
    }
}
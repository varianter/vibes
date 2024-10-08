using System.Globalization;
using Api.Common;
using Core.Consultants;
using Core.Organizations;
using Core.Vacations;
using Infrastructure.DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Api.VacationsController;

[Authorize]
[Route("/v0/{orgUrlKey}/vacations")]
[ApiController]
public class VacationsController(
    ApplicationContext context,
    IMemoryCache cache,
    IOrganisationRepository organisationRepository) : ControllerBase
{
    [HttpGet]
    [Route("publicHolidays")]
    public async Task<ActionResult<List<DateOnly>>> GetPublicHolidays([FromRoute] string orgUrlKey,
        CancellationToken ct)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, ct);
        if (selectedOrg is null) return BadRequest();

        var service = new StorageService(cache, context);
        var publicHolidays = service.LoadPublicHolidays(orgUrlKey);
        if (publicHolidays is null) return BadRequest("Something went wrong fetching public holidays");

        return publicHolidays;
    }

    [HttpGet]
    [Route("{consultantId}/get")]
    public async Task<ActionResult<VacationReadModel>> GetVacations([FromRoute] string orgUrlKey,
        [FromRoute] int consultantId, CancellationToken ct)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, ct);
        if (selectedOrg is null) return BadRequest();

        var service = new StorageService(cache, context);

        if (!VacationsValidator.ValidateVacation(consultantId, service, orgUrlKey))
            return BadRequest();

        var vacationDays = service.LoadConsultantVacation(consultantId);
        var consultant = service.GetBaseConsultantById(consultantId);
        if (consultant is null) return BadRequest();
        var vacationMetaData = new VacationMetaData(consultant, DateOnly.FromDateTime(DateTime.Now));
        return new VacationReadModel(consultantId, vacationDays, vacationMetaData);
    }

    [HttpDelete]
    [Route("{consultantId}/{date}/delete")]
    public async Task<ActionResult<VacationReadModel>> DeleteVacation([FromRoute] string orgUrlKey,
        [FromRoute] int consultantId,
        [FromRoute] string date,
        CancellationToken ct)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, ct);
        if (selectedOrg is null) return BadRequest();

        var service = new StorageService(cache, context);

        if (!VacationsValidator.ValidateVacation(consultantId, service, orgUrlKey))
            return BadRequest();

        try
        {
            var dateObject = DateOnly.FromDateTime(DateTime.Parse(date, CultureInfo.InvariantCulture));
            service.RemoveVacationDay(consultantId, dateObject, orgUrlKey);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest("Something went wrong");
        }

        var vacationDays = service.LoadConsultantVacation(consultantId);
        var consultant = service.GetBaseConsultantById(consultantId);
        if (consultant is null) return BadRequest();
        var vacationMetaData = new VacationMetaData(consultant, DateOnly.FromDateTime(DateTime.Now));
        return new VacationReadModel(consultantId, vacationDays, vacationMetaData);
    }

    [HttpPut]
    [Route("{consultantId}/{date}/update")]
    public async Task<ActionResult<VacationReadModel>> UpdateVacation([FromRoute] string orgUrlKey,
        [FromRoute] int consultantId,
        [FromRoute] string date,
        CancellationToken ct)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, ct);
        if (selectedOrg is null) return BadRequest();

        var service = new StorageService(cache, context);

        if (!VacationsValidator.ValidateVacation(consultantId, service, orgUrlKey))
            return BadRequest();

        try
        {
            var dateObject = DateOnly.FromDateTime(DateTime.Parse(date));
            service.AddVacationDay(consultantId, dateObject, orgUrlKey);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest("Something went wrong");
        }

        var vacationDays = service.LoadConsultantVacation(consultantId);
        var consultant = service.GetBaseConsultantById(consultantId);
        if (consultant is null) return BadRequest();
        var vacationMetaData = new VacationMetaData(consultant, DateOnly.FromDateTime(DateTime.Now));
        return new VacationReadModel(consultantId, vacationDays, vacationMetaData);
    }
}

public record VacationMetaData(int DaysTotal, int TransferredDays, int Planned, int Used, int LeftToPlan)
{
    public VacationMetaData(Consultant consultant, DateOnly day) : this(
        consultant.TotalAvailableVacationDays,
        consultant.TransferredVacationDays,
        consultant.GetPlannedVacationDays(day),
        consultant.GetUsedVacationDays(day),
        consultant.GetRemainingVacationDays(day)
    )
    {
    }
}

public record VacationReadModel(int ConsultantId, List<DateOnly> VacationDays, VacationMetaData VacationMetaData)
{
    public VacationReadModel(int consultantId, List<Vacation> vacations, VacationMetaData vacationMetaData) : this(
        consultantId, vacations.Select(v => v.Date).ToList(), vacationMetaData)
    {
    }
}
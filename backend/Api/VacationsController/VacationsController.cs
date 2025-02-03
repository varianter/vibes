using System.Globalization;
using Api.Common;
using Core.Consultants;
using Core.Organizations;
using Core.Vacations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// ReSharper disable NotAccessedPositionalProperty.Global

namespace Api.VacationsController;

[Authorize]
[Route("/v0/{orgUrlKey}/vacations")]
[ApiController]
public class VacationsController(
    IStorageService storageService,
    IOrganisationRepository organisationRepository,
    IConsultantRepository consultantRepository) : ControllerBase
{
    [HttpGet]
    [Route("publicHolidays")]
    public async Task<ActionResult<List<DateOnly>>> GetPublicHolidays([FromRoute] string orgUrlKey,
        CancellationToken cancellationToken)
    {
        var organization = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, cancellationToken);
        if (organization is null) return BadRequest();

        var year = DateOnly.FromDateTime(DateTime.Now).Year;

        var publicHolidays =
            organization.GetPublicHolidays(year)
                .Concat(organization.GetPublicHolidays(year + 1))
                .Concat(organization.GetPublicHolidays(year + 2)).ToList();

        return publicHolidays;
    }

    [HttpGet]
    [Route("{consultantId}/get")]
    public async Task<ActionResult<VacationReadModel>> GetVacations([FromRoute] string orgUrlKey,
        [FromRoute] int consultantId, CancellationToken cancellationToken)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, cancellationToken);
        if (selectedOrg is null) return BadRequest();

        var vacationDays = storageService.LoadConsultantVacation(consultantId);
        var consultant = await consultantRepository.GetConsultantById(consultantId, cancellationToken);

        if (consultant is null || !VacationsValidator.ValidateVacation(consultant, orgUrlKey))
            return NotFound();

        var vacationMetaData = new VacationMetaData(consultant, DateOnly.FromDateTime(DateTime.Now));
        return new VacationReadModel(consultantId, vacationDays, vacationMetaData);
    }

    [HttpDelete]
    [Route("{consultantId}/{date}/delete")]
    public async Task<ActionResult<VacationReadModel>> DeleteVacation([FromRoute] string orgUrlKey,
        [FromRoute] int consultantId,
        [FromRoute] string date,
        CancellationToken cancellationToken)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, cancellationToken);
        if (selectedOrg is null) return BadRequest();

        var vacationDays = storageService.LoadConsultantVacation(consultantId);
        var consultant = await consultantRepository.GetConsultantById(consultantId, cancellationToken);

        if (consultant is null || !VacationsValidator.ValidateVacation(consultant, orgUrlKey))
            return NotFound();

        try
        {
            var dateObject = DateOnly.FromDateTime(DateTime.Parse(date, CultureInfo.InvariantCulture));
            storageService.RemoveVacationDay(consultantId, dateObject, orgUrlKey);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest("Something went wrong");
        }

        var vacationMetaData = new VacationMetaData(consultant, DateOnly.FromDateTime(DateTime.Now));
        return new VacationReadModel(consultantId, vacationDays, vacationMetaData);
    }

    [HttpPut]
    [Route("{consultantId}/{date}/update")]
    public async Task<ActionResult<VacationReadModel>> UpdateVacation([FromRoute] string orgUrlKey,
        [FromRoute] int consultantId,
        [FromRoute] string date,
        CancellationToken cancellationToken)
    {
        var selectedOrg = await organisationRepository.GetOrganizationByUrlKey(orgUrlKey, cancellationToken);
        if (selectedOrg is null) return BadRequest();

        var vacationDays = storageService.LoadConsultantVacation(consultantId);
        var consultant = await consultantRepository.GetConsultantById(consultantId, cancellationToken);

        if (consultant is null || !VacationsValidator.ValidateVacation(consultant, orgUrlKey))
            return NotFound();

        try
        {
            var dateObject = DateOnly.FromDateTime(DateTime.Parse(date, CultureInfo.InvariantCulture));
            storageService.AddVacationDay(consultantId, dateObject, orgUrlKey);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest("Something went wrong");
        }


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
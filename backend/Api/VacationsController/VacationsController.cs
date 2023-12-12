using System.Globalization;
using Api.Common;
using Database.DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Api.VacationsController;
[Authorize]
[Route("/v0/{orgUrlKey}/vacations")]
[ApiController]
public class VacationsController : ControllerBase
{
    private readonly IMemoryCache _cache;
    private readonly ApplicationContext _context;

    public VacationsController(ApplicationContext context, IMemoryCache cache)
    {
        _context = context;
        _cache = cache;
    }

    [HttpGet]
    [Route("publicHolidays")]
    public ActionResult<List<DateOnly>> Get([FromRoute] string orgUrlKey)
    {
        //TODO: Validate that consultant is in organisation
        //TODO: Year?
        var selectedOrg = _context.Organization.SingleOrDefault(org => org.UrlKey == orgUrlKey);
        if (selectedOrg is null) return BadRequest();

        var service = new StorageService(_cache, _context);
        var publicHolidays = service.LoadPublicHolidays(orgUrlKey);
        if (publicHolidays is null) return BadRequest("Something went wrong fetching public holidays");

        return publicHolidays;
    }

    [HttpGet]
    [Route("{consultantId}/get")]

    public ActionResult<VacationReadModel> Get([FromRoute] string orgUrlKey,
        [FromRoute] int consultantId)
    {
        //TODO: Validate that consultant is in organisation
        //TODO: Year?
        var selectedOrg = _context.Organization.SingleOrDefault(org => org.UrlKey == orgUrlKey);
        if (selectedOrg is null) return BadRequest();

        var service = new StorageService(_cache, _context);
        var vacationDays = service.LoadConsultantVacation(consultantId);
        var vacationMetaData = ReadModelFactory.GetVacationMetaData(selectedOrg, vacationDays);
        return ReadModelFactory.MapToReadModel(consultantId, vacationDays, vacationMetaData);
    }

    [HttpDelete]
    [Route("{consultantId}/{date}/delete")]
    public ActionResult<VacationReadModel> Delete([FromRoute] string orgUrlKey,
        [FromRoute] int consultantId,
        [FromRoute] string date)
    {
        var selectedOrg = _context.Organization.SingleOrDefault(org => org.UrlKey == orgUrlKey);
        if (selectedOrg is null) return BadRequest();

        var service = new StorageService(_cache, _context);
        try
        {
            var dateObject = DateOnly.FromDateTime(DateTime.Parse(date, CultureInfo.InvariantCulture));
            service.RemoveVacationDay(consultantId, dateObject);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }

        var vacationDays = service.LoadConsultantVacation(consultantId);
        var vacationMetaData = ReadModelFactory.GetVacationMetaData(selectedOrg, vacationDays);
        return ReadModelFactory.MapToReadModel(consultantId, vacationDays, vacationMetaData);
    }

    [HttpPut]
    [Route("{consultantId}/{date}/update")]

    public ActionResult<VacationReadModel> Put([FromRoute] string orgUrlKey,
        [FromRoute] int consultantId,
        [FromRoute] string date)
    {
        var selectedOrg = _context.Organization.SingleOrDefault(org => org.UrlKey == orgUrlKey);
        if (selectedOrg is null) return BadRequest();

        var service = new StorageService(_cache, _context);

        try
        {
            var dateObject = DateOnly.FromDateTime(DateTime.Parse(date));
            service.AddVacationDay(consultantId, dateObject);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }

        var vacationDays = service.LoadConsultantVacation(consultantId);
        var vacationMetaData = ReadModelFactory.GetVacationMetaData(selectedOrg, vacationDays);
        return ReadModelFactory.MapToReadModel(consultantId, vacationDays, vacationMetaData);
    }

}
public record VacationMetaData(int DaysTotal, int TransferredDays, int Planned, int Used, int LeftToPlan);
public record VacationReadModel(int ConsultantId, List<DateOnly> VacationDays, VacationMetaData VacationMetaData);



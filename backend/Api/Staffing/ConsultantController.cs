using Api.Common;
using Core.DomainModels;
using Database.DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using NuGet.Protocol;

namespace Api.Staffing;

[Authorize]
[Route("/v0/{orgUrlKey}/consultants")]
[ApiController]
public class ConsultantController : ControllerBase
{
    private readonly IMemoryCache _cache;
    private readonly ApplicationContext _context;

    public ConsultantController(ApplicationContext context, IMemoryCache cache)
    {
        _context = context;
        _cache = cache;
    }

    [HttpGet]
    public ActionResult<List<ConsultantReadModel>> Get(
        [FromRoute] string orgUrlKey,
        [FromQuery(Name = "Year")] int? selectedYearParam = null,
        [FromQuery(Name = "Week")] int? selectedWeekParam = null,
        [FromQuery(Name = "WeekSpan")] int numberOfWeeks = 8,
        [FromQuery(Name = "includeOccupied")] bool includeOccupied = true)
    {
        var selectedWeek = selectedYearParam is null || selectedWeekParam is null
            ? Week.FromDateTime(DateTime.Now)
            : new Week((int)selectedYearParam, (int)selectedWeekParam);

        var weekSet = selectedWeek.GetNextWeeks(numberOfWeeks);

        var service = new StorageService(_cache, _context);
        var readModels = new ReadModelFactory(service).GetConsultantReadModelsForWeeks(orgUrlKey, weekSet);
        return Ok(readModels);
    }
    
    [HttpPut]
    [Route("staffing/{staffingId}")]
    public ActionResult<List<ConsultantReadModel>>Put(
            [FromRoute] string orgUrlKey,
            [FromRoute] int staffingId,
            [FromQuery(Name = "BookingType")] BookingType bookingType = BookingType.Booking,
            [FromQuery(Name = "Hours")] double hours = 0
        )
    {
        var service = new StorageService(_cache, _context);
        Console.Write(bookingType);
        if (bookingType == BookingType.Booking || bookingType == BookingType.Offer)
        {
           service.UpdateStaffing(staffingId, hours);
        }

        if (bookingType == BookingType.PlannedAbsence)
        {
            service.UpdateAbsence(staffingId, hours);
        }
        return Ok(hours);
    }
}
using Api.Common;
using Core.DomainModels;
using Core.Services;
using Database.DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

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
        var selectedYear = selectedYearParam ?? DateTime.Now.Year;
        var selectedWeekNumber = selectedWeekParam ?? DateService.GetWeekNumber(DateTime.Now);
        var selectedWeek = new Week(selectedYear, selectedWeekNumber);
        var weekSet = DateService.GetNextWeeks(selectedWeek, numberOfWeeks);

        var service = new StorageService(_cache, _context);
        var readModels = new ReadModelFactory(service).GetConsultantReadModelsForWeeks(orgUrlKey, weekSet);
        return Ok(readModels);
    }
}
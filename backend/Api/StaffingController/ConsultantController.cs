using System.Configuration;
using Api.Common;
using Core.DomainModels;
using Database.DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Api.StaffingController;

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
    [Route("staffing/update")]
    public ActionResult<List<ConsultantReadModel>> Put(
        [FromRoute] string orgUrlKey,
        [FromBody] StaffingWriteModel staffingWriteModel
    )
    {
        var service = new StorageService(_cache, _context);

        if (!StaffingControllerValidator.ValidateStaffingWriteModel(staffingWriteModel, service, orgUrlKey))
        {
            return BadRequest();
        }

        try
        {
            var selectedWeek = new Week(staffingWriteModel.Year, staffingWriteModel.Week);

            switch (staffingWriteModel.Type)
            {
                case BookingType.Booking:
                case BookingType.Offer:
                    service.UpdateOrCreateStaffing(new StaffingKey(staffingWriteModel.EngagementId, staffingWriteModel.ConsultantId, selectedWeek), staffingWriteModel.Hours, orgUrlKey);
                    break;
                case BookingType.PlannedAbsence:
                    service.UpdateOrCreatePlannedAbsence(new PlannedAbsenceKey(staffingWriteModel.EngagementId, staffingWriteModel.ConsultantId, selectedWeek), staffingWriteModel.Hours, orgUrlKey);
                    break;
                case BookingType.Vacation:
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(staffingWriteModel.Type), staffingWriteModel.Type, "Invalid bookingType");
            }

        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }


        return Ok("Status ok");
    }

}
public record StaffingWriteModel(BookingType Type, int ConsultantId, int EngagementId, int Year, int Week,
   [property: LongValidator(MinValue = 0, MaxValue = 100)] double Hours);

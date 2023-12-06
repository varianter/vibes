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
    public ActionResult<ConsultantReadModel> Put(
        [FromRoute] string orgUrlKey,
        [FromBody] StaffingWriteModel staffingWriteModel
    )
    {
        var service = new StorageService(_cache, _context);

        if (!StaffingControllerValidator.ValidateStaffingWriteModel(staffingWriteModel, service, orgUrlKey))
            return BadRequest();
        var selectedWeek = new Week(staffingWriteModel.StartYear, staffingWriteModel.StartWeek);
        try
        {
            switch (staffingWriteModel.Type)
            {
                case BookingType.Booking:
                case BookingType.Offer:
                    service.UpdateOrCreateStaffing(
                        new StaffingKey(staffingWriteModel.EngagementId, staffingWriteModel.ConsultantId, selectedWeek),
                        staffingWriteModel.Hours, orgUrlKey
                    );
                    break;
                case BookingType.PlannedAbsence:
                    service.UpdateOrCreatePlannedAbsence(
                        new PlannedAbsenceKey(staffingWriteModel.EngagementId, staffingWriteModel.ConsultantId,
                            selectedWeek), staffingWriteModel.Hours, orgUrlKey);
                    break;
                case BookingType.Vacation:
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(staffingWriteModel.Type), staffingWriteModel.Type,
                        "Invalid bookingType");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }

        return new ReadModelFactory(service).GetConsultantReadModelForWeek(
            staffingWriteModel.ConsultantId, selectedWeek);
    }

    [HttpPut]
    [Route("staffing/update/several")]
    public ActionResult<ConsultantReadModel> Put(
        [FromRoute] string orgUrlKey,
        [FromBody] SeveralStaffingWriteModel severalStaffingWriteModel
    )
    {
        var service = new StorageService(_cache, _context);

        if (!StaffingControllerValidator.ValidateStaffingWriteModel(severalStaffingWriteModel, service, orgUrlKey))
            return BadRequest();

        var startWeek = new Week(severalStaffingWriteModel.StartYear, severalStaffingWriteModel.StartWeek);
        var endWeek = new Week(severalStaffingWriteModel.EndYear, severalStaffingWriteModel.EndWeek);

        var weekSet = startWeek.CompareTo(endWeek) < 0
            ? startWeek.GetNextWeeks(endWeek)
            : endWeek.GetNextWeeks(startWeek);
        try
        {
            switch (severalStaffingWriteModel.Type)
            {
                case BookingType.Booking:
                case BookingType.Offer:
                    service.UpdateOrCreateStaffings(severalStaffingWriteModel.ConsultantId,
                        severalStaffingWriteModel.EngagementId, weekSet, severalStaffingWriteModel.Hours, orgUrlKey);
                    break;
                case BookingType.PlannedAbsence:
                    service.UpdateOrCreatePlannedAbsences(severalStaffingWriteModel.ConsultantId,
                        severalStaffingWriteModel.EngagementId, weekSet, severalStaffingWriteModel.Hours, orgUrlKey);
                    break;
                case BookingType.Vacation:
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(severalStaffingWriteModel.Type),
                        severalStaffingWriteModel.Type, "Invalid bookingType");
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }

        return new ReadModelFactory(service).GetConsultantReadModelForWeeks(
            severalStaffingWriteModel.ConsultantId, weekSet);
        ;
    }
}

public record StaffingWriteModel(
    BookingType Type,
    int ConsultantId,
    int EngagementId,
    int StartYear,
    int StartWeek,
    double Hours);

public record SeveralStaffingWriteModel(
    BookingType Type,
    int ConsultantId,
    int EngagementId,
    int StartYear,
    int StartWeek,
    int EndYear,
    int EndWeek,
    double Hours);
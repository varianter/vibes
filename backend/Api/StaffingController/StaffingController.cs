using System.Diagnostics;
using Api.Common;
using Api.Common.Types;
using Api.Helpers;
using Core.Consultants;
using Core.Extensions;
using Core.PlannedAbsences;
using Core.Staffings;
using Core.Weeks;
using Infrastructure.DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace Api.StaffingController;

[Authorize]
[Route("/v0/{orgUrlKey}/staffings")]
[ApiController]
public class StaffingController(
    ApplicationContext context,
    IMemoryCache cache,
    ILogger<StorageService> logger,
    IStaffingRepository staffingRepository,
    IPlannedAbsenceRepository plannedAbsenceRepository)
    : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> Get(
        [FromRoute] string orgUrlKey,
        CancellationToken cancellationToken,
        [FromQuery(Name = "Year")] int? selectedYearParam = null,
        [FromQuery(Name = "Week")] int? selectedWeekParam = null,
        [FromQuery(Name = "WeekSpan")] int numberOfWeeks = 8,
        [FromQuery(Name = "includeOccupied")] bool includeOccupied = true)
    {
        var stopwatch = Stopwatch.StartNew();
        Console.WriteLine($"GET STAFFINGS - [Checkpoint 0] Start - {stopwatch.ElapsedMilliseconds} ms");
        var selectedWeek = selectedYearParam is null || selectedWeekParam is null
            ? Week.FromDateTime(DateTime.Now)
            : new Week((int)selectedYearParam, (int)selectedWeekParam);

        var weekSet = selectedWeek.GetNextWeeks(numberOfWeeks);

        var service = new StorageService(cache, logger, context);
        Console.WriteLine($"GET STAFFINGS - [Checkpoint 1] Service created - {stopwatch.ElapsedMilliseconds} ms");
        var consultants = service.LoadConsultants(orgUrlKey);
        Console.WriteLine($"GET STAFFINGS - [Checkpoint 2] Loaded consultants - {stopwatch.ElapsedMilliseconds} ms");
        consultants = await AddRelationalDataToConsultant(consultants, cancellationToken);
        Console.WriteLine($"GET STAFFINGS - [Checkpoint 6] Add relational data completed - {stopwatch.ElapsedMilliseconds} ms");

        var readModels = ReadModelFactory.GetConsultantReadModelsForWeeks(consultants, weekSet);
        Console.WriteLine($"GET STAFFINGS - [Checkpoint 7] Created read models - {stopwatch.ElapsedMilliseconds} ms");
        stopwatch.Stop();

        return Ok(readModels);
    }

    [HttpGet]
    [Route("project/{projectId}")]
    public ActionResult<List<StaffingReadModel>> GetConsultantsInProject(
        [FromRoute] string orgUrlKey,
        [FromRoute] int projectId,
        [FromQuery] bool isAbsence = false,
        [FromQuery(Name = "Year")] int? selectedYearParam = null,
        [FromQuery(Name = "Week")] int? selectedWeekParam = null,
        [FromQuery(Name = "WeekSpan")] int numberOfWeeks = 8)
    {
        var selectedWeek = selectedYearParam is null || selectedWeekParam is null
            ? Week.FromDateTime(DateTime.Now)
            : new Week((int)selectedYearParam, (int)selectedWeekParam);

        var weekSet = selectedWeek.GetNextWeeks(numberOfWeeks);

        var service = new StorageService(cache, logger, context);

        switch (isAbsence)
        {
            // -1 as projectId and isAbsence == true is a workaround to get vacations
            case true when projectId == -1:
                {
                    var vacationReadModel =
                        new ReadModelFactory(service).GetConsultantsReadModelsForVacationsAndWeeks(orgUrlKey, weekSet);
                    return Ok(vacationReadModel);
                }
            case true:
                {
                    var absenceReadModel =
                        new ReadModelFactory(service).GetConsultantsReadModelsForAbsenceAndWeeks(orgUrlKey, weekSet,
                            projectId);
                    return Ok(absenceReadModel);
                }
            default:
                {
                    var readModels =
                        new ReadModelFactory(service).GetConsultantsReadModelsForProjectAndWeeks(orgUrlKey, weekSet,
                            projectId);
                    return Ok(readModels);
                }
        }
    }


    [HttpPut]
    [Route("update")]
    public async Task<ActionResult<StaffingReadModel>> Put(
        [FromRoute] string orgUrlKey,
        [FromBody] StaffingWriteModel staffingWriteModel,
        CancellationToken cancellationToken
    )
    {
        var service = new StorageService(cache, logger, context);

        if (!StaffingControllerValidator.ValidateStaffingWriteModel(staffingWriteModel, service, orgUrlKey))
            return BadRequest();
        var selectedWeek = new Week(staffingWriteModel.StartYear, staffingWriteModel.StartWeek);
        try
        {
            switch (staffingWriteModel.Type)
            {
                case BookingType.Booking:
                case BookingType.Offer:
                    var updatedStaffing = CreateStaffing(
                        new StaffingKey(staffingWriteModel.EngagementId,
                            staffingWriteModel.ConsultantId, selectedWeek), staffingWriteModel.Hours);

                    await staffingRepository.UpsertStaffing(updatedStaffing, cancellationToken);

                    //TODO: Remove this once repositories for planned absence and vacations are done too
                    cache.ClearConsultantCache(orgUrlKey);
                    break;
                case BookingType.PlannedAbsence:
                    var updatedAbsence = CreateAbsence(new PlannedAbsenceKey(staffingWriteModel.EngagementId,
                        staffingWriteModel.ConsultantId,
                        selectedWeek), staffingWriteModel.Hours);

                    await plannedAbsenceRepository.UpsertPlannedAbsence(updatedAbsence, cancellationToken);

                    //TODO: Remove this once repositories for planned absence and vacations are done too
                    cache.ClearConsultantCache(orgUrlKey);
                    break;
                case BookingType.Vacation:
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(staffingWriteModel), staffingWriteModel.Type,
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
    [Route("update/several")]
    public async Task<ActionResult<StaffingReadModel>> Put(
        [FromRoute] string orgUrlKey,
        [FromBody] SeveralStaffingWriteModel severalStaffingWriteModel,
        CancellationToken cancellationToken
    )
    {
        var service = new StorageService(cache, logger, context);

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
                    var updatedStaffings = GenerateUpdatedStaffings(severalStaffingWriteModel.ConsultantId,
                        severalStaffingWriteModel.EngagementId, weekSet, severalStaffingWriteModel.Hours, orgUrlKey);

                    await staffingRepository.UpsertMultipleStaffings(updatedStaffings, cancellationToken);

                    //TODO: Remove this once repositories for planned absence and vacations are done too
                    cache.ClearConsultantCache(orgUrlKey);
                    break;
                case BookingType.PlannedAbsence:
                    var updatedAbsences = GenerateUpdatedAbsences(severalStaffingWriteModel.ConsultantId,
                        severalStaffingWriteModel.EngagementId, weekSet, severalStaffingWriteModel.Hours, orgUrlKey);

                    await plannedAbsenceRepository.UpsertMultiplePlannedAbsences(updatedAbsences, cancellationToken);

                    //TODO: Remove this once repositories for planned absence and vacations are done too
                    cache.ClearConsultantCache(orgUrlKey);
                    break;
                case BookingType.Vacation:
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(severalStaffingWriteModel),
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
    }

    // TODO: Move this to a future application layer. This is to consolidate data from various repositories such as Staffing or PlannedAbsence


    private async Task<List<Consultant>> AddRelationalDataToConsultant(
        List<Consultant> consultants, CancellationToken cancellationToken)
    {
        var stopwatch = Stopwatch.StartNew(); // Start tracking time

        var consultantIds = consultants.Select(c => c.Id).Distinct().ToList();
        Console.WriteLine($"ADDING RELATIONAL DATA - [Checkpoint 3] Extracted consultant IDs - {stopwatch.ElapsedMilliseconds} ms");

        var consultantStaffings = await staffingRepository.GetStaffingForConsultants(consultantIds, cancellationToken);
        Console.WriteLine($"ADDING RELATIONAL DATA - [Checkpoint 4] Retrieved staffing data - {stopwatch.ElapsedMilliseconds} ms");

        var consultantAbsences = await plannedAbsenceRepository.GetPlannedAbsenceForConsultants(consultantIds, cancellationToken);
        Console.WriteLine($"ADDING RELATIONAL DATA - [Checkpoint 5] Retrieved absence data - {stopwatch.ElapsedMilliseconds} ms");

        var result = consultants.Select(c =>
        {
            c.Staffings = DictionaryHelper.GetFromDictOrDefault(c.Id, consultantStaffings);
            c.PlannedAbsences = DictionaryHelper.GetFromDictOrDefault(c.Id, consultantAbsences);
            return c;
        }).ToList();
        Console.WriteLine($"ADDING RELATIONAL DATA - [Checkpoint 6] Mapped data to consultants - {stopwatch.ElapsedMilliseconds} ms");

        stopwatch.Stop(); // Stop tracking
        Console.WriteLine($"ADDING RELATIONAL DATA - [Total Execution Time] {stopwatch.ElapsedMilliseconds} ms");

        return result;
    }


    //TODO: Divide this more neatly into various functions for readability. 
    // This is skipped for now to avoid massive scope-creep. Comments are added for a temporary readability-buff
    private List<Staffing> GenerateUpdatedStaffings(int consultantId, int engagementId,
            List<Week> weeks,
            double hours,
            string orgUrlKey)
    {
        // Get base data we need.
        var consultant = context.Consultant.Single(c => c.Id == consultantId);
        var project = context.Project.Single(p => p.Id == engagementId);

        var org = context.Organization.FirstOrDefault(o => o.UrlKey == orgUrlKey);

        // Create one new staffing for each week 
        var staffingsToUpsert = weeks.Select(week =>
        {
            // This is a variable as we may change it to adapt to maximum possible booking
            var newHours = hours;
            if (org != null)
            {
                // Calculates the max hours we can add without overbooking due to vacations, absences, etc
                var holidayHours = org.GetTotalHolidayHoursOfWeek(week);
                var vacations = context.Vacation.Where(v => v.ConsultantId.Equals(consultantId)).ToList();
                var vacationHours = vacations.Count(v => week.ContainsDate(v.Date)) * org.HoursPerWorkday;
                var plannedAbsenceHours = context.PlannedAbsence
                    .Where(pa => pa.Week.Equals(week) && pa.ConsultantId.Equals(consultantId))
                    .Select(pa => pa.Hours).Sum();

                var total = holidayHours + vacationHours + plannedAbsenceHours;

                newHours = hours + total > org.HoursPerWorkday * 5
                    ? Math.Max(org.HoursPerWorkday * 5 - total, 0)
                    : hours;
            }


            var staffing = context.Staffing
                .FirstOrDefault(s => s.EngagementId.Equals(engagementId)
                                     && s.ConsultantId.Equals(consultantId)
                                     && s.Week.Equals(week));

            if (staffing is null)
                return new Staffing
                {
                    EngagementId = engagementId,
                    Engagement = project,
                    ConsultantId = consultantId,
                    Consultant = consultant,
                    Hours = newHours,
                    Week = week
                };

            // Set it again in case it was found in query above
            staffing.Hours = newHours;
            return staffing;
        }).ToList();

        return staffingsToUpsert;
    }

    private List<PlannedAbsence> GenerateUpdatedAbsences(int consultantId, int absenceId, List<Week> weeks,
        double hours,
        string orgUrlKey)
    {
        var consultant = context.Consultant.Single(c => c.Id == consultantId);
        var absence = context.Absence.Single(a => a.Id == absenceId);

        var org = context.Organization.FirstOrDefault(o => o.UrlKey == orgUrlKey);
        return weeks.Select(week =>
        {
            var newHours = hours;
            if (org != null)
            {
                var holidayHours = org.GetTotalHolidayHoursOfWeek(week);
                newHours = holidayHours + hours > org.HoursPerWorkday * 5
                    ? Math.Max(org.HoursPerWorkday * 5 - holidayHours, 0)
                    : hours;
            }

            var plannedAbsence = context.PlannedAbsence
                .FirstOrDefault(pa => pa.AbsenceId.Equals(absenceId)
                                      && pa.ConsultantId.Equals(consultantId)
                                      && pa.Week.Equals(week));

            if (plannedAbsence is null)
                plannedAbsence = new PlannedAbsence
                {
                    AbsenceId = absenceId,
                    Absence = absence,
                    ConsultantId = consultantId,
                    Consultant = consultant,
                    Hours = newHours,
                    Week = week
                };
            else
                plannedAbsence.Hours = newHours;

            return plannedAbsence;
        }).ToList();
    }

    private Staffing CreateStaffing(StaffingKey staffingKey, double hours)
    {
        // TODO; Rewrite this to not query relations
        var consultant = context.Consultant.Single(c => c.Id == staffingKey.ConsultantId);
        var project = context.Project.Single(p => p.Id == staffingKey.EngagementId);

        return new Staffing
        {
            EngagementId = staffingKey.EngagementId,
            Engagement = project,
            ConsultantId = staffingKey.ConsultantId,
            Consultant = consultant,
            Hours = hours,
            Week = staffingKey.Week
        };
    }

    private PlannedAbsence CreateAbsence(PlannedAbsenceKey plannedAbsenceKey, double hours)
    {
        var consultant = context.Consultant.Single(c => c.Id == plannedAbsenceKey.ConsultantId);
        var absence = context.Absence.Single(a => a.Id == plannedAbsenceKey.AbsenceId);

        var plannedAbsence = new PlannedAbsence
        {
            AbsenceId = plannedAbsenceKey.AbsenceId,
            Absence = absence,
            ConsultantId = plannedAbsenceKey.ConsultantId,
            Consultant = consultant,
            Hours = hours,
            Week = plannedAbsenceKey.Week
        };
        return plannedAbsence;
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
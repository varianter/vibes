using Api.Cache;
using Core.DomainModels;
using Core.Services;
using Database.DatabaseContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Api.Consultants;

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
        [FromQuery(Name = "weeks")] int numberOfWeeks = 8,
        [FromQuery(Name = "includeOccupied")] bool includeOccupied = true)
    {
        var selectedYear = selectedYearParam ?? DateTime.Now.Year;
        var selectedWeekNumber = selectedWeekParam ?? DateService.GetWeekNumber(DateTime.Now);
        var selectedWeek = new Week(selectedYear, selectedWeekNumber);
        var weekSet = DateService.GetNextWeeks(selectedWeek, numberOfWeeks);

        var consultants = GetConsultantReadModels(orgUrlKey, weekSet)
            .Where(c =>
                includeOccupied
                || c.IsOccupied
            )
            .ToList();

        return Ok(consultants);
    }

    private List<ConsultantReadModel> GetConsultantReadModels(string orgUrlKey, List<Week> weeks)
    {
        var initialWeekKey = weeks.First().ToSortableInt();
        var cacheKey = $"{orgUrlKey}/{weeks.Count}/{initialWeekKey}/{CacheKeys.ConsultantReadModels}";
        var cacheHadReadModel = _cache.TryGetValue(cacheKey,
            out List<ConsultantReadModel>? consultantReadModels);

        if (cacheHadReadModel && consultantReadModels is not null) return consultantReadModels;

        var loadedReadModels = LoadReadModelFromDb(orgUrlKey, weeks);
        _cache.Set(cacheKey, loadedReadModels);
        return loadedReadModels;
    }


    private Dictionary<StaffingGroupKey, double> LoadStaffingByProjectTypeForWeeks(List<Week> weeks,
        ProjectState state)
    {
        var firstWeek = weeks.First().ToSortableInt();
        var lastWeek = weeks.Last().ToSortableInt();
        
        return _context.Staffing
            .Where(staffing => firstWeek <= (staffing.Year * 100 + staffing.Week) && (staffing.Year * 100 + staffing.Week) <= lastWeek) //Compare weeks by using the format yyyyww, for example 202352 and 202401
            .Where(staffing =>
                staffing.Project.State == state)
            .Include(s => s.Consultant)
            .Include(staffing => staffing.Project)
            .GroupBy(staffing =>
                new StaffingGroupKey(staffing.Consultant.Id, staffing.Project.Id, staffing.Year, staffing.Week))
            .ToDictionary(grouping => grouping.Key, g => g.Sum(staffing => staffing.Hours));
    }

    private List<ConsultantReadModel> LoadReadModelFromDb(string orgUrlKey, List<Week> weekSet)
    {
        weekSet.Sort();
        var firstWeek = weekSet.First().ToSortableInt();
        var lastWeek = weekSet.Last().ToSortableInt();
        
        var firstDayInScope = DateService.FirstDayOfWorkWeek(weekSet.First());
        var firstWorkDayOutOfScope = DateService.LastWorkDayOfWeek(weekSet.Last()).AddDays(1);

        var consultants = _context.Consultant.Include(consultant => consultant.Department)
            .ThenInclude(department => department.Organization)
            .Where(c => c.EndDate == null || c.EndDate > firstDayInScope)
            .Where(c => c.StartDate == null || c.StartDate <= firstWorkDayOutOfScope)
            .Where(c => c.Department.Organization.UrlKey == orgUrlKey)
            .OrderBy(c => c.Name)
            .ToList();

        var projects = _context.Project.Include(p => p.Customer)
            .ToDictionary(project => project.Id, project => project);
        var absences = _context.Absence.ToDictionary(absence => absence.Id, absence => absence);

        var billableStaffing = LoadStaffingByProjectTypeForWeeks(weekSet, ProjectState.Active);
        var offeredStaffing = LoadStaffingByProjectTypeForWeeks(weekSet, ProjectState.Offer);

        var plannedAbsences = _context.PlannedAbsence
            .Include(plannedAbsence => plannedAbsence.Consultant)
            .Include(plannedAbsence => plannedAbsence.Absence)
            .Where(absence => firstWeek <= (absence.Year * 100 + absence.WeekNumber) && (absence.Year * 100 + absence.WeekNumber) <= lastWeek) //Compare weeks by using the format yyyyww, for example 202352 and 202401
            .GroupBy(plannedAbsence =>
                new StaffingGroupKey(plannedAbsence.Consultant.Id, plannedAbsence.Absence.Id, plannedAbsence.Year,
                    plannedAbsence.WeekNumber))
            .ToDictionary(
                grouping => grouping.Key,
                grouping => grouping.Sum(plannedAbsence => plannedAbsence.Hours));


        var vacations = _context.Vacation
            .Where(vacation => firstDayInScope <= vacation.Date && vacation.Date <= firstWorkDayOutOfScope)
            .Include(vacation => vacation.Consultant)
            .GroupBy(vacation => vacation.Consultant.Id)
            .ToList();

        var consultantReadModels = consultants.Select(c =>
        {
            var billableSet = billableStaffing.Where(g => g.Key.ConsultantId == c.Id)
                .ToDictionary(pair => pair.Key, pair => pair.Value);
            var offeredSet = offeredStaffing.Where(g => g.Key.ConsultantId == c.Id)
                .ToDictionary(pair => pair.Key, pair => pair.Value);
            var absenceSet = plannedAbsences.Where(g => g.Key.ConsultantId == c.Id)
                .ToDictionary(pair => pair.Key, pair => pair.Value);

            var consultantVacations = vacations.Where(g => g.Key == c.Id).Aggregate(new List<Vacation>(),
                (list, grouping) => list.Concat(grouping.Select(v => v)).ToList());

            var detailedBookings =
                DetailedBookings(c, projects, absences, billableSet, offeredSet, absenceSet, consultantVacations,
                    weekSet);

            return c.MapToReadModelList(detailedBookings, weekSet);
        }).ToList();

        return consultantReadModels;
    }


    /// <summary>
    ///     Takes in many data points collected from the DB, and joins them into a set of DetailedBookings
    ///     for a given consultant and set of weeks
    /// </summary>
    private static List<DetailedBooking> DetailedBookings(Consultant consultant,
        Dictionary<int, Project> projects, Dictionary<int, Absence> absences,
        Dictionary<StaffingGroupKey, double> billableStaffing,
        Dictionary<StaffingGroupKey, double> offeredStaffing,
        Dictionary<StaffingGroupKey, double> plannedAbsences,
        List<Vacation> vacations,
        List<Week> weekSet)
    {
        weekSet.Sort();

        var billableProjects = UniqueWorkTypes(projects, billableStaffing);
        var offeredProjects = UniqueWorkTypes(projects, offeredStaffing);
        var plannedAbsenceTypes = UniqueWorkTypes(absences, plannedAbsences);

        var billableBookings = billableProjects.Select(project => new DetailedBooking(project.Customer.Name,
                BookingType.Booking,
                WeeklyHoursList(weekSet, billableStaffing, project.Id)))
            .ToList();

        var offeredBookings = offeredProjects.Select(project => new DetailedBooking(project.Customer.Name,
                BookingType.Offer,
                WeeklyHoursList(weekSet, billableStaffing, project.Id)))
            .ToList();

        var plannedAbsencesPrWeek = plannedAbsenceTypes.Select(absence => new DetailedBooking(absence.Name,
                BookingType.PlannedAbsence,
                WeeklyHoursList(weekSet, billableStaffing, absence.Id)))
            .ToList();

        var detailedBookings = billableBookings.Concat(offeredBookings).Concat(plannedAbsencesPrWeek);

        if (vacations.Count > 0)
        {
            var vacationsPrWeek = weekSet.Select(week => new WeeklyHours(
                week.ToSortableInt(),
                vacations.Count(vacation => DateService.DateIsInWeek(vacation.Date, week)) *
                consultant.Department.Organization.HoursPerWorkday
            )).ToList();
            detailedBookings = detailedBookings.Append(new DetailedBooking(
                new BookingDetails("Ferie", BookingType.Vacation),
                vacationsPrWeek));
        }

        var detailedBookingList = detailedBookings.ToList();

        // Remove empty rows
        detailedBookingList.RemoveAll(detailedBooking => detailedBooking.Hours.Sum(hours => hours.Hours) == 0);

        return detailedBookingList;
    }

    private static List<T> UniqueWorkTypes<T>(Dictionary<int, T> workTypes,
        Dictionary<StaffingGroupKey, double> billableStaffing)
    {
        return billableStaffing.Keys
            .Select(key => key.WorkTypeId)
            .Distinct()
            .Select(id => workTypes[id])
            .ToList();
    }

    private static List<WeeklyHours> WeeklyHoursList(List<Week> weeks,
        Dictionary<StaffingGroupKey, double> staffingDictionary,
        int workTypeId)
    {
        return weeks.Select(week => new WeeklyHours(
            week.ToSortableInt(),
            staffingDictionary
                .Where(staffing =>
                    staffing.Key.WorkTypeId == workTypeId
                    && staffing.Key.Year == week.Year
                    && staffing.Key.Week == week.WeekNumber)
                .Sum(kvPair => kvPair.Value)
        )).ToList();
    }
}

public record StaffingGroupKey(int ConsultantId, int WorkTypeId, int Year, int Week);
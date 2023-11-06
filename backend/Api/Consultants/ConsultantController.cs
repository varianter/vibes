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


    private List<IGrouping<StaffingGroupKey, Staffing>> LoadStaffingByProjectTypeForWeeks(List<Week> weeks,
        ProjectState state)
    {
        var year = weeks[0].Year;
        var minWeek = weeks.Select(w => w.WeekNumber).Min();
        var maxWeek = weeks.Select(w => w.WeekNumber).Max();


        return _context.Staffing
            .Where(staffing => staffing.Year == year && minWeek <= staffing.Week && staffing.Week <= maxWeek)
            .Where(staffing =>
                staffing.Project.State == state)
            .Include(s => s.Consultant)
            .Include(staffing => staffing.Project)
            .GroupBy(s => new StaffingGroupKey(s.Consultant.Id, s.Project.Id, s.Year, s.Week))
            .ToList();
    }

    private List<ConsultantReadModel> LoadReadModelFromDb(string orgUrlKey, List<Week> weekSet)
    {
        var year = weekSet[0].Year;
        var minWeek = weekSet.Select(w => w.WeekNumber).Min();
        var maxWeek = weekSet.Select(w => w.WeekNumber).Min();

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
            .Where(absence => absence.Year == year && minWeek <= absence.WeekNumber && absence.WeekNumber <= maxWeek)
            .GroupBy(plannedAbsence =>
                new StaffingGroupKey(plannedAbsence.Consultant.Id, plannedAbsence.Absence.Id, plannedAbsence.Year,
                    plannedAbsence.WeekNumber))
            .ToList();


        var vacations = _context.Vacation
            .Where(vacation => firstDayInScope <= vacation.Date && vacation.Date <= firstWorkDayOutOfScope)
            .Include(vacation => vacation.Consultant)
            .GroupBy(vacation => vacation.Consultant.Id)
            .ToList();

        var consultantReadModels = consultants.Select(c =>
        {
            var billableSet = billableStaffing.Where(g => g.Key.ConsultantId == c.Id);
            var offeredSet = offeredStaffing.Where(g => g.Key.ConsultantId == c.Id);
            var absenceSet = plannedAbsences.Where(g => g.Key.ConsultantId == c.Id);

            var consultantVacations = vacations.Where(g => g.Key == c.Id).Aggregate(new List<Vacation>(),
                (list, grouping) => list.Concat(grouping.Select(v => v)).ToList());

            if (c.Id == 33)
                Console.Out.Write("Her");

            var detailedBookings =
                DetailedBookings(c, projects, absences, billableSet, offeredSet, absenceSet, consultantVacations,
                    weekSet);

            return c.MapToReadModelList(detailedBookings, weekSet);
        }).ToList();

        return consultantReadModels;
    }

    private static List<DetailedBooking> DetailedBookings(Consultant consultant,
        Dictionary<int, Project> projects, Dictionary<int, Absence> absences,
        IEnumerable<IGrouping<StaffingGroupKey, Staffing>> billableStaffings,
        IEnumerable<IGrouping<StaffingGroupKey, Staffing>> offeredStaffings,
        IEnumerable<IGrouping<StaffingGroupKey, PlannedAbsence>> plannedAbsences,
        List<Vacation> vacations,
        List<Week> weekSet)
    {
        weekSet.Sort();

        var billableArray = billableStaffings as IGrouping<StaffingGroupKey, Staffing>[] ?? billableStaffings.ToArray();
        var billableProjects = billableArray.Select(a => a.Key.WorkTypeId).Distinct().Select(id => projects[id]);
        var offeredArray = offeredStaffings as IGrouping<StaffingGroupKey, Staffing>[] ?? offeredStaffings.ToArray();
        var offeredProjects = offeredArray.Select(a => a.Key.WorkTypeId).Distinct().Select(id => projects[id])
            .ToList();

        var absenceArray = plannedAbsences as IGrouping<StaffingGroupKey, PlannedAbsence>[] ??
                           plannedAbsences.ToArray();
        var plannedAbsenceTypes =
            absenceArray.Select(a => a.Key.WorkTypeId).Distinct().Select(id => absences[id]).ToList();


        // TODO: These can probably be made smaller
        var billableBookings = billableProjects.Select(project =>
        {
            var bookings = weekSet.Select(week => new WeeklyHours(week.ToSortableInt(), billableArray
                .Where(g => g.Key.ConsultantId == consultant.Id && g.Key.WorkTypeId == project.Id &&
                            g.Key.Year == week.Year &&
                            g.Key.Week == week.WeekNumber)
                .Select(g => g.Select(staffing => staffing.Hours).Sum())
                .Sum()
            )).ToList();

            return new DetailedBooking(new BookingDetails(project.Customer.Name, BookingType.Booking), bookings);
        }).ToList();

        var offeredBookings = offeredProjects.Select(project =>
        {
            var bookings = weekSet.Select(week => new WeeklyHours(week.ToSortableInt(), offeredArray
                .Where(g => g.Key.ConsultantId == consultant.Id && g.Key.WorkTypeId == project.Id &&
                            g.Key.Year == week.Year &&
                            g.Key.Week == week.WeekNumber)
                .Select(g => g.Select(staffing => staffing.Hours).Sum())
                .Sum()
            )).ToList();

            return new DetailedBooking(new BookingDetails(project.Customer.Name, BookingType.Offer), bookings);
        }).ToList();

        var plannedAbsencesPrWeek = plannedAbsenceTypes.Select(absenceType =>
        {
            var bookings = weekSet.Select(week => new WeeklyHours(week.ToSortableInt(), absenceArray
                .Where(g => g.Key.ConsultantId == consultant.Id && g.Key.WorkTypeId == absenceType.Id &&
                            g.Key.Year == week.Year &&
                            g.Key.Week == week.WeekNumber)
                .Select(g => g.Select(staffing => staffing.Hours).Sum())
                .Sum()
            )).ToList();

            return new DetailedBooking(new BookingDetails(absenceType.Name, BookingType.PlannedAbsence), bookings);
        }).ToList();


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

        return detailedBookings.ToList();
    }
}

public record StaffingGroupKey(int ConsultantId, int WorkTypeId, int Year, int Week);
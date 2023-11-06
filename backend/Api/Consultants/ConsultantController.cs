using System.Diagnostics;
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
        var watch = Stopwatch.StartNew();

        var selectedYear = selectedYearParam ?? DateTime.Now.Year;
        var selectedWeekNumber = selectedWeekParam ?? DateService.GetWeekNumber(DateTime.Now);
        var selectedWeek = new Week(selectedYear, selectedWeekNumber);
        var consultants = GetConsultantsWithAvailability(orgUrlKey, selectedWeek, numberOfWeeks)
            .Where(c =>
                includeOccupied
                || c.IsOccupied
            )
            .ToList();

        watch.Stop();

        return Ok(new { Time = watch.ElapsedMilliseconds, Data = consultants });
    }

    [HttpGet("perf")]
    public ActionResult<List<ConsultantReadModel>> GetFast()
    {
        var watch = Stopwatch.StartNew();

        var weekSet = DateService.GetNextWeeks(new Week(2023, 44), 8);

        var minDate = new DateOnly(2023, 11, 1);
        var maxDate = new DateOnly(2023, 12, 1);

        var year = weekSet[0].Year;
        var minWeek = weekSet.Select(w => w.WeekNumber).Min();
        var maxWeek = weekSet.Select(w => w.WeekNumber).Min();


        var consultants = _context.Consultant.Include(consultant => consultant.Department)
            .ThenInclude(department => department.Organization).ToList();

        var projects = _context.Project.Include(p => p.Customer)
            .ToDictionary(project => project.Id, project => project);
        var absences = _context.Absence.ToDictionary(absence => absence.Id, absence => absence);

        var billableStaffings = LoadStaffingByProjectTypeForWeeks(weekSet, ProjectState.Active);
        var offeredStaffings = LoadStaffingByProjectTypeForWeeks(weekSet, ProjectState.Offer);

        var plannedAbsences = _context.PlannedAbsence
            .Include(plannedAbsence => plannedAbsence.Consultant)
            .Include(plannedAbsence => plannedAbsence.Absence)
            .Where(absence => absence.Year == year && minWeek <= absence.WeekNumber && absence.WeekNumber <= maxWeek)
            .GroupBy(plannedAbsence =>
                new StaffingGroupKey(plannedAbsence.Consultant.Id, plannedAbsence.Absence.Id, plannedAbsence.Year,
                    plannedAbsence.WeekNumber))
            .ToList();


        var vacations = _context.Vacation
            .Where(vacation => minDate <= vacation.Date && vacation.Date <= maxDate)
            .Include(vacation => vacation.Consultant)
            .GroupBy(vacation => vacation.Consultant.Id)
            .ToList();

        var a = consultants.Select(c =>
        {
            var billableSet = billableStaffings.Where(g =>
                g.Key.ConsultantId == c.Id);
            var offeredSet = offeredStaffings
                .Where(g => g.Key.ConsultantId == c.Id);
            var absenceSet = plannedAbsences.Where(g => g.Key.ConsultantId == c.Id);

            var consultantVacations = vacations.Where(g => g.Key == c.Id).Aggregate(new List<Vacation>(),
                (list, grouping) => list.Concat(grouping.Select(v => v)).ToList());

            return ConsultantReadModel.FromController(c, projects, absences, billableSet, offeredSet, absenceSet,
                consultantVacations, weekSet);
        }).ToList();
        watch.Stop();

        return Ok(new { Time = watch.ElapsedMilliseconds, Data = a });
    }


    private List<ConsultantReadModel> GetConsultantsWithAvailability(string orgUrlKey, Week initialWeekNumber,
        int numberOfWeeks)
    {
        if (numberOfWeeks == 8 && false)
        {
            _cache.TryGetValue(
                $"{orgUrlKey}/{initialWeekNumber}/{CacheKeys.ConsultantAvailability8Weeks}",
                out List<ConsultantReadModel>? cachedConsultants);
            if (cachedConsultants != null) return cachedConsultants;
        }

        var consultants = LoadConsultantAvailability(orgUrlKey, initialWeekNumber, numberOfWeeks)
            .Select(c => c.MapConsultantToReadModel(initialWeekNumber, numberOfWeeks)).ToList();

        _cache.Set($"{orgUrlKey}/{initialWeekNumber}/{CacheKeys.ConsultantAvailability8Weeks}", consultants);
        return consultants;
    }

    private List<IGrouping<StaffingGroupKey, Staffing>> LoadStaffingByProjectTypeForWeeks(List<Week> weeks,
        ProjectState state)
    {
        var year = weeks[0].Year;
        var minWeek = weeks.Select(w => w.WeekNumber).Min();
        var maxWeek = weeks.Select(w => w.WeekNumber).Min();


        return _context.Staffing
            .Where(staffing => staffing.Year == year && minWeek <= staffing.Week && staffing.Week <= maxWeek)
            .Where(staffing =>
                staffing.Project.State == state)
            .Include(s => s.Consultant)
            .Include(staffing => staffing.Project)
            .GroupBy(s => new StaffingGroupKey(s.Consultant.Id, s.Project.Id, s.Year, s.Week))
            .ToList();
    }


    private List<Consultant> LoadConsultantAvailability(string orgUrlKey, Week selectedWeek, int numberOfWeeks)
    {
        var applicableWeeks = DateService.GetNextWeeks(selectedWeek, numberOfWeeks);
        var firstDayOfCurrentWeek = DateService.GetFirstDayOfWeekContainingDate(DateTime.Now);
        var firstWorkDayOutOfScope =
            DateService.GetFirstDayOfWeekContainingDate(DateTime.Now.AddDays(numberOfWeeks * 7));

        // Needed to filter planned absence and staffing.
        // From november, we will span two years. 
        // Given a 5-week span, the set of weeks can look like this: (2022) 51, 52, 53, 1, 2 (2023)
        // Then we can filter as follows: Either the staffing has year 2022 and a week between 51 and 53, or year 2023 with weeks 1 and 2. 
        var minWeekNum = applicableWeeks.Select(w => w.WeekNumber).Min();

        // Set A will be either the weeks in the next year (2023 in the above example), or have all the weeks in a mid-year case
        var yearA = applicableWeeks.Select(w => w.Year).Max();
        var weeksInA = applicableWeeks.Select(w => w.WeekNumber).Where(w => w < minWeekNum + numberOfWeeks).ToList();
        var minWeekA = weeksInA.Min();
        var maxWeekA = weeksInA.Max();

        // Set B will be either the weeks in the current year (2022 in the above example), or and empty set in a mid-year case. 
        var yearB = applicableWeeks.Select(w => w.Year).Min();
        var weeksInB = applicableWeeks.Select(w => w.WeekNumber).Where(w => w < minWeekNum + numberOfWeeks).ToList();
        var minWeekB = weeksInB.Min();
        var maxWeekB = weeksInB.Max();


        return _context.Consultant
            .Where(c => c.EndDate == null || c.EndDate > firstDayOfCurrentWeek)
            .Where(c => c.StartDate == null || c.StartDate <= firstWorkDayOutOfScope)
            .Include(c => c.Vacations)
            .Include(c => c.Competences)
            .Include(c => c.PlannedAbsences.Where(pa =>
                (pa.Year <= yearA && minWeekA <= pa.WeekNumber && pa.WeekNumber <= maxWeekA)
                || (yearB <= pa.Year && minWeekB <= pa.WeekNumber && pa.WeekNumber <= maxWeekB)))
            .ThenInclude(pa => pa.Absence)
            .Include(c => c.Department)
            .ThenInclude(d => d.Organization)
            .Where(c => c.Department.Organization.UrlKey == orgUrlKey)
            .Include(c => c.Staffings.Where(s =>
                (s.Year <= yearA && minWeekA <= s.Week && s.Week <= maxWeekA)
                || (yearB <= s.Year && minWeekB <= s.Week && s.Week <= maxWeekB)))
            .ThenInclude(s => s.Project)
            .ThenInclude(p => p.Customer)
            .OrderBy(c => c.Name)
            .ToList();
    }
}

public record StaffingGroupKey(int ConsultantId, int WorkTypeId, int Year, int Week);

public record WeeklyBooking(int YearWeek, double TotalBillable, double TotalOffered);
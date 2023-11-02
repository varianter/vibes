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
        var consultants = GetConsultantsWithAvailability(orgUrlKey, selectedWeek, numberOfWeeks)
            .Where(c =>
                includeOccupied
                || c.IsOccupied
            )
            .ToList();

        return Ok(consultants);
    }


    private List<ConsultantReadModel> GetConsultantsWithAvailability(string orgUrlKey, Week initialWeekNumber,
        int numberOfWeeks)
    {
        if (numberOfWeeks == 8)
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
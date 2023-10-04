using Api.Cache;
using Core.DomainModels;
using Core.Services;
using Database.DatabaseContext;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Api.Consultants;

public static class ConsultantApi
{
    public static void MapConsultantApi(this RouteGroupBuilder group)
    {
        group.MapGet("/", GetAllConsultants);
        group.MapGet("/{id}", GetConsultantById);
        group.MapPost("/", AddBasicConsultant);
    }

    private static Ok<List<ConsultantReadModel>> GetAllConsultants(ApplicationContext context, IMemoryCache cache,
        [FromQuery(Name = "weeks")] int numberOfWeeks = 8,
        [FromQuery(Name = "includeOccupied")] bool includeOccupied = false)
    {
        var consultants = GetConsultantsWithAvailability(context, cache, numberOfWeeks)
            .Where(c =>
                includeOccupied
                || c.HasAvailability
            ).ToList();

        return TypedResults.Ok(consultants);
    }


    private static Ok<ConsultantReadModel> GetConsultantById(ApplicationContext context, IMemoryCache cache, int id,
        [FromQuery(Name = "weeks")] int numberOfWeeks = 8)
    {
        var consultants = GetConsultantsWithAvailability(context, cache, numberOfWeeks);
        return TypedResults.Ok(consultants.Single(c => c.Id == id));
    }

    private static ConsultantReadModel MapToReadModel(this Consultant consultant, int weeks)
    {
        const double tolerance = 0.1;
        var bookedHours = consultant.GetBookedHoursForWeeks(weeks);

        var hasAvailability = bookedHours.Any(b => b.BookedHours <= ConsultantExtensions.GetHoursPrWeek() - tolerance);

        return new ConsultantReadModel(
            consultant.Id,
            consultant.Name,
            consultant.Email,
            consultant.Competences.Select(comp => comp.Name).ToList(),
            consultant.Department.Name,
            bookedHours,
            hasAvailability);
    }

    private static List<ConsultantReadModel> GetConsultantsWithAvailability(ApplicationContext context,
        IMemoryCache cache, int numberOfWeeks)
    {
        if (numberOfWeeks == 8)
        {
            cache.TryGetValue(CacheKeys.ConsultantAvailability8Weeks, out List<ConsultantReadModel>? cachedConsultants);
            if (cachedConsultants != null) return cachedConsultants;
        }

        var consultants = LoadConsultantAvailability(context, numberOfWeeks);

        cache.Set(CacheKeys.ConsultantAvailability8Weeks, consultants);
        return consultants;
    }

    private static List<ConsultantReadModel> LoadConsultantAvailability(ApplicationContext context, int numberOfWeeks)
    {
        var applicableWeeks = DateService.GetNextWeeks(numberOfWeeks);

        // Needed to filter planned absence and staffing.
        // From november, we will span two years. 
        // Given a 5-week span, the set of weeks can look like this: (2022) 51, 52, 53, 1, 2 (2023)
        // Then we can filter as follows: Either the staffing has year 2022 and a week between 51 and 53, or year 2023 with weeks 1 and 2. 
        var minWeekNum = applicableWeeks.Select(w => w.week).Min();

        // Set A will be either the weeks in the next year (2023 in the above example), or have all the weeks in a mid-year case
        var yearA = applicableWeeks.Select(w => w.year).Max();
        var weeksInA = applicableWeeks.Select(w => w.week).Where(w => w < minWeekNum + numberOfWeeks).ToList();
        var minWeekA = weeksInA.Min();
        var maxWeekA = weeksInA.Max();

        // Set B will be either the weeks in the current year (2022 in the above example), or and empty set in a mid-year case. 
        var yearB = applicableWeeks.Select(w => w.year).Min();
        var weeksInB = applicableWeeks.Select(w => w.week).Where(w => w < minWeekNum + numberOfWeeks).ToList();
        var minWeekB = weeksInB.Min();
        var maxWeekB = weeksInB.Max();


        return context.Consultant
            .Include(c => c.Vacations)
            .Include(c => c.Competences)
            .Include(c => c.PlannedAbsences.Where(pa =>
                (pa.Year <= yearA && minWeekA <= pa.WeekNumber && pa.WeekNumber <= maxWeekA)
                || (yearB <= pa.Year && minWeekB <= pa.WeekNumber && pa.WeekNumber <= maxWeekB)))
            .Include(c => c.Department)
            .Include(c => c.Staffings.Where(s =>
                (s.Year <= yearA && minWeekA <= s.Week && s.Week <= maxWeekA)
                || (yearB <= s.Year && minWeekB <= s.Week && s.Week <= maxWeekB)))
            .Select(c => c.MapToReadModel(numberOfWeeks))
            .ToList();
    }


    private static async Task<Results<Created<ConsultantWriteModel>, ProblemHttpResult, ValidationProblem>> AddBasicConsultant(
        ApplicationContext db,
        IMemoryCache cache,
        [FromBody] ConsultantWriteModel basicVariant)
    {
        try
        {
            var selectedDepartment = await GetDepartmentByIdAsync(db, basicVariant.DepartmentId);
            if (selectedDepartment == null)
            {
                return TypedResults.Problem("Department does not exist", statusCode: 400);
            }

            var consultantList = await GetAllConsultantsAsync(db);
            var validationResults = ConsultantValidators.ValidateUniqueness(consultantList, basicVariant);

            if (validationResults.Count > 0)
            {
                return TypedResults.ValidationProblem(validationResults);
            }

            var newConsultant = CreateConsultantFromModel(basicVariant, selectedDepartment);
            await AddConsultantToDatabaseAsync(db, newConsultant);
            ClearConsultantCache(cache);

            return TypedResults.Created($"/variant/{newConsultant.Id}", basicVariant);
        }
        catch (Exception ex)
        {
            // Adding exception handling later
            return TypedResults.Problem("An error occurred while processing the request", statusCode: 500);
        }
    }

    private static async Task<Department?> GetDepartmentByIdAsync(ApplicationContext db, string departmentId)
    {
        return await db.Department.SingleOrDefaultAsync(d => d.Id == departmentId);
    }

    private static async Task<List<Consultant>> GetAllConsultantsAsync(ApplicationContext db)
    {
        return await db.Consultant.ToListAsync();
    }

    private static Consultant CreateConsultantFromModel(ConsultantWriteModel basicVariant,
        Department selectedDepartment)
    {
        return new Consultant
        {
            Name = basicVariant.Name,
            Email = basicVariant.Email,
            Department = selectedDepartment
        };
    }

    private static async Task AddConsultantToDatabaseAsync(ApplicationContext db, Consultant newConsultant)
    {
        await db.Consultant.AddAsync(newConsultant);
        await db.SaveChangesAsync();
    }

    private static void ClearConsultantCache(IMemoryCache cache)
    {
        cache.Remove(CacheKeys.ConsultantAvailability8Weeks);
    }


    public record ConsultantWriteModel(string Name, string Email, string DepartmentId);

    private record ConsultantReadModel(int Id, string Name, string Email, List<string> Competences, string Department,
        List<BookedHoursPerWeek> Bookings, bool HasAvailability);

}
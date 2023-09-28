using Api.Cache;
using Core.DomainModels;
using Database.DatabaseContext;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Api.Routes;

public static class ConsultantApi
{
    public static void MapConsultantApi(this RouteGroupBuilder group)
    {
        group.MapGet("/", GetAllConsultants);
        group.MapGet("/{id}", GetConsultantById);
        group.MapPost("/", AddConsultant).WithOpenApi();
    }

    private static Ok<List<ConsultantReadModel>> GetAllConsultants(ApplicationContext context, IMemoryCache cache,
        [FromQuery(Name = "weeks")] int numberOfWeeks = 8)
    {
        if (
            numberOfWeeks == 8 &&
            cache.TryGetValue(CacheKeys.ConsultantAvailability8Weeks, out List<ConsultantReadModel>? data)
        )
            return TypedResults.Ok(data);

        var consultants = context.Consultant
            .Include(c => c.Vacations)
            .Include(c => c.PlannedAbsences)
            .Include(c => c.Department)
            .ThenInclude(d => d.Organization)
            .Select(c => c.MapToReadModel(numberOfWeeks))
            .ToList();

        cache.Set(CacheKeys.ConsultantAvailability8Weeks, consultants);
        return TypedResults.Ok(consultants);
    }

    private static Results<Ok<ConsultantReadModel>, NotFound> GetConsultantById(ApplicationContext context, int id,
        [FromQuery(Name = "weeks")] int numberOfWeeks = 8)
    {
        var consultant = context.Consultant.Where(c => c.Id == id)
            .Include(c => c.Vacations)
            .Include(c => c.PlannedAbsences)
            .Include(c => c.Department)
            .ThenInclude(d => d.Organization)
            .Select(c => c.MapToReadModel(numberOfWeeks))
            .SingleOrDefault();

        return consultant is null ? TypedResults.NotFound() : TypedResults.Ok(consultant);
    }

    private static async Task<Created<Consultant>> AddConsultant(ApplicationContext db, IMemoryCache cache,
        Consultant variant)
    {
        await db.Consultant.AddAsync(variant);
        await db.SaveChangesAsync();
        cache.Remove(CacheKeys.ConsultantAvailability8Weeks);
        return TypedResults.Created($"/variant/{variant.Id}", variant);
    }

    private static ConsultantReadModel MapToReadModel(this Consultant consultant, int weeks)
    {
        return new ConsultantReadModel(
            consultant.Id,
            consultant.Name,
            consultant.Email,
            consultant.Competences.Select(comp => comp.Name).ToList(),
            consultant.Department.Name,
            consultant.GetAvailableHoursForNWeeks(weeks));
    }

    private record ConsultantReadModel(int Id, string Name, string Email, List<string> Competences, string Department,
        List<AvailabilityPerWeek> Availability);
}
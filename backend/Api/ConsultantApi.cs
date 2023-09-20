using backend.ApplicationCore.DomainModels;
using backend.Database.Contexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Api;

public static class ConsultantApi
{
    public static void RegisterConsultantApi(this WebApplication app)
    {
        app.MapGet("/variant", GetAllConsultants)
            .WithName("Varianter")
            .WithOpenApi();

        app.MapGet("/variant/{id}", GetConsultantById)
            .WithOpenApi();

        app.MapPost("/variant", AddConsultant).WithOpenApi();
    }

    private static IResult GetAllConsultants(ApplicationContext context,
        [FromQuery(Name = "weeks")] int numberOfWeeks = 8)
    {
        var consultants = context.Consultant
            .Include(c => c.Vacations)
            .Include(c => c.PlannedAbsences)
            .Include(c => c.Department)
            .ThenInclude(d => d.Organization)
            .Select(c => new ConsultantReadModel(c, numberOfWeeks))
            .ToList();

        return Results.Ok(consultants);
    }

    private static IResult GetConsultantById(ApplicationContext context, int id,
        [FromQuery(Name = "weeks")] int numberOfWeeks = 8)
    {
        var consultant = context.Consultant.Where(c => c.Id == id)
            .Include(c => c.Vacations)
            .Include(c => c.PlannedAbsences)
            .Include(c => c.Department)
            .ThenInclude(d => d.Organization)
            .Select(c => new ConsultantReadModel(c, numberOfWeeks))
            .Single();

        return Results.Ok(consultant);
    }

    private static async Task<IResult> AddConsultant(ApplicationContext db, Consultant variant)
    {
        await db.Consultant.AddAsync(variant);
        await db.SaveChangesAsync();
        return Results.Created($"/variant/{variant.Id}", variant);
    }

    private record ConsultantReadModel(int Id, string Name, string Email, List<string> Competences, string Department,
        List<AvailabilityPerWeek> Availability)
    {
        public ConsultantReadModel(Consultant consultant, int weeks) : this(
            consultant.Id,
            consultant.Name,
            consultant.Email,
            consultant.Competences.Select(comp => comp.Name).ToList(),
            consultant.Department.Name,
            consultant.GetAvailableHoursForNWeeks(weeks))
        {
        }
    }
}
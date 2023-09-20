using backend.ApplicationCore.DomainModels;
using backend.Database.Contexts;
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
    
    private record ConsultantReadModel(int Id, string Name, string Email, List<string> Competences, string Department,
        double Availability)
    {
        public ConsultantReadModel(Consultant consultant) : this(
            consultant.Id, 
            consultant.Name, 
            consultant.Email,
            consultant.Competences.Select(comp => comp.Name).ToList(), 
            consultant.Department.Name,
            consultant.GetAvailableHours())
        { }
    }

    private static IResult GetAllConsultants(ApplicationContext context)
    {
        var consultants = context.Consultant
            .Include(c => c.Vacations)
            .Include(c => c.PlannedAbsences)
            .Include(c => c.Department)
            .ThenInclude(d => d.Organization)
            .Select(c => new ConsultantReadModel(c))
            .ToList();

        return Results.Ok(consultants);
    }

    private static IResult GetConsultantById(ApplicationContext context, int id)
    {
        var consultant = context.Consultant.Where(c => c.Id == id)
            .Include(c => c.Vacations)
            .Include(c => c.PlannedAbsences)
            .Include(c => c.Department)
            .ThenInclude(d => d.Organization)
            .Select(c => new ConsultantReadModel(c))
            .Single();

        return Results.Ok(consultant);
    }

    private static async Task<IResult> AddConsultant(ApplicationContext db, Consultant variant)
    {
        await db.Consultant.AddAsync(variant);
        await db.SaveChangesAsync();
        return Results.Created($"/variant/{variant.Id}", variant);
    }
}
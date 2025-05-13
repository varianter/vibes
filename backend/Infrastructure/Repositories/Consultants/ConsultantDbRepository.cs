using Core.Consultants;
using Core.Consultants.Competences;
using Core.PersonnelTeam;
using Infrastructure.DatabaseContext;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace Infrastructure.Repositories.Consultants;

public class ConsultantDbRepository(ApplicationContext context) : IConsultantRepository
{
    public Task<Consultant?> GetConsultantById(int id, CancellationToken cancellationToken)
    {
        return BaseConsultantQuery()
            .SingleOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<Consultant?> GetConsultantByEmail(string orgUrlKey, string email,
        CancellationToken cancellationToken)
    {
        var consultant = await BaseConsultantQuery()
            .SingleOrDefaultAsync(c => c.Email == email, cancellationToken);

        if (consultant is null || consultant.Department.Organization.UrlKey != orgUrlKey) return null;

        return consultant;
    }

    public async Task<List<PersonnelTeam>> GetPersonnelTeamsInOrganizationByUrlKey(string urlKey,
        CancellationToken cancellationToken)
    {
        return await context.PersonnelTeams
            .Where(m => m.OrganizationUrlKey == urlKey)
            .ToListAsync(cancellationToken);
    }

    public Task<List<Consultant>> GetConsultantsInOrganizationByUrlKey(string urlKey,
        CancellationToken cancellationToken)
    {
        return BaseConsultantQuery()
            .Where(c => c.Department.Organization.UrlKey == urlKey)
            .ToListAsync(cancellationToken);
    }

    public async Task<Consultant?> UpdateDiscipline(int consultantId, string? disciplineId,
        CancellationToken cancellationToken)
    {
        var affectedRows = await context.Consultant.Where(c => c.Id == consultantId)
            .ExecuteUpdateAsync(c => c.SetProperty(x => x.DisciplineId, disciplineId), cancellationToken);

        if (affectedRows == 0) return null;

        return await BaseConsultantQuery().SingleOrDefaultAsync(c => c.Id == consultantId, cancellationToken);
    }


    public async Task<IResult> UpdatePersonnelTeamByConsultantId(int consultantId, int? personnelTeamId,
        CancellationToken cancellationToken)
    {
        var consultant = await context.Consultant.SingleOrDefaultAsync(c => c.Id == consultantId, cancellationToken);
        
        if (consultant == null)
        {
            return Results.NotFound($"Could not find consultant with id {consultantId}");
        }
        
        await context.PersonnelTeamByConsultants
            .Where(c => c.ConsultantId == consultantId)
            .ExecuteDeleteAsync(cancellationToken);
        
        if (personnelTeamId != null)
        {
            var personnelTeamByConsultant = new PersonnelTeamByConsultant
            {
                ConsultantId = consultantId,
                PersonnelTeamId = (int)personnelTeamId
            };
            await context.PersonnelTeamByConsultants.AddAsync(personnelTeamByConsultant, cancellationToken);
        }

        await context.SaveChangesAsync(cancellationToken);
        return Results.Ok();
    }


    /*
     * Ensures consistent Includes to keep expected base data present
     */
    private IIncludableQueryable<Consultant, Competence> BaseConsultantQuery()
    {
        return context.Consultant
            .Include(c => c.Discipline)
            .Include(c => c.Department)
            .ThenInclude(d => d.Organization)
            .Include(c => c.CompetenceConsultant)
            .ThenInclude(cc => cc.Competence);
    }
}
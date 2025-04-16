using Core.Consultants;
using Core.Consultants.Competences;
using Core.Consultants.PersonnelTeam;
using Infrastructure.DatabaseContext;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
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

    public async Task<List<PersonnelTeam>> GetPersonnelTeamInOrganizationByUrlKey(string urlKey,
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

    public async Task<List<Consultant>> GetMembersByPersonnelTeamId(string orgUrlKey, int personnelTeamId,
        CancellationToken cancellationToken)
    {
        var listOfMemberIds = await context.PersonnelTeamByConsultants
            .Where(pt => pt.PersonnelTeamId == personnelTeamId)
            .Select(pt => pt.ConsultantId)
            .ToListAsync(cancellationToken);

        return await BaseConsultantQuery()
            .Where(consultant => listOfMemberIds.Contains(consultant.Id) &&
                                 consultant.Department.Organization.UrlKey == orgUrlKey)
            .ToListAsync(cancellationToken);
    }

    public async Task<Consultant?> GetLeaderByPersonnelTeamId(int personnelTeamId, CancellationToken cancellationToken)
    {
        var personnelTeam = await context.PersonnelTeams
            .Where(c => c.Id == personnelTeamId)
            .FirstOrDefaultAsync(cancellationToken);

        if (personnelTeam == null) return null;

        return await BaseConsultantQuery().SingleOrDefaultAsync(c => c.Id == personnelTeam.LeaderId, cancellationToken);
    }

    public async Task<int> CreatePersonnelTeam(string urlKey, int leaderId, CancellationToken cancellationToken)
    {
        var personnelTeam = new PersonnelTeam
        {
            LeaderId = leaderId,
            OrganizationUrlKey = urlKey,
        };

        var savedPersonnelTeam = await context.PersonnelTeams.AddAsync(personnelTeam, cancellationToken);

        await context.SaveChangesAsync(cancellationToken);
        return savedPersonnelTeam.Entity.Id;
    }

    public async Task<IResult> UpdatePersonnelTeamByConsultantId(int consultantId, int? personnelTeamId, CancellationToken cancellationToken)
    {
        var affectedRows = await context.PersonnelTeamByConsultants
            .Where(c => c.ConsultantId == consultantId)
            .ExecuteDeleteAsync(cancellationToken);
        if (affectedRows == 0)
        {
            return Results.NotFound($"Could not find consultant with id {consultantId}");
        }
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

    public async Task<Task<IResult>> DeletePersonnelTeam(int personnelTeamId, CancellationToken cancellationToken)
    {
        var deletedRows = await context.PersonnelTeams
            .Where(m => m.Id == personnelTeamId)
            .ExecuteDeleteAsync(cancellationToken);
        if (deletedRows == 0)
        {
<<<<<<< HEAD
            return Task.FromResult(Results.NotFound($"Could not find personnelTeam with id {personnelTeamId}"));
        }
        
        var deletedMembers = await context.PersonnelTeamByConsultants
            .Where(m => m.PersonnelTeamId == personnelTeamId)
            .ExecuteDeleteAsync(cancellationToken);
=======
            return Task.FromResult(Results.NotFound($"Could not find mentor with id {personnelTeamId}"));
        }
>>>>>>> 08aa68f (feat: adds 'AddPersonnelTeam' migration)

        await context.SaveChangesAsync(cancellationToken);
        return Task.FromResult(Results.Ok($"Deleted personnel team and {deletedMembers} members"));   
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
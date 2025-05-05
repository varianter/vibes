using Core.Consultants;
using Core.Consultants.Competences;
using Core.PersonnelTeam;
using Infrastructure.DatabaseContext;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace Infrastructure.Repositories.PersonnelTeams;

public class PersonnelTeamDbRepository(ApplicationContext context) : IPersonnelTeamRepository
{
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

    public async Task<IResult> DeletePersonnelTeam(int personnelTeamId, CancellationToken cancellationToken)
    {
        var deletedRows = await context.PersonnelTeams
            .Where(m => m.Id == personnelTeamId)
            .ExecuteDeleteAsync(cancellationToken);
        if (deletedRows == 0)
        {
            return Results.NotFound($"Could not find personnelTeam with id {personnelTeamId}");
        }

        var deletedMembers = await context.PersonnelTeamByConsultants
            .Where(m => m.PersonnelTeamId == personnelTeamId)
            .ExecuteDeleteAsync(cancellationToken);

        await context.SaveChangesAsync(cancellationToken);
        return Results.Ok($"Deleted personnel team and {deletedMembers} members");
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
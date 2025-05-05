using Core.Consultants;
using Microsoft.AspNetCore.Http;

namespace Core.PersonnelTeam;

public interface IPersonnelTeamRepository
{
    Task<List<Consultant>> GetMembersByPersonnelTeamId(string orgUrlKey, int personnelTeamId, CancellationToken cancellationToken);
    Task<Consultant?> GetLeaderByPersonnelTeamId(int personnelTeamId, CancellationToken cancellationToken);
    Task<int> CreatePersonnelTeam(string urlKey, int leaderId, CancellationToken cancellationToken);
    Task<IResult> DeletePersonnelTeam(int personnelTeamId, CancellationToken cancellationToken);
}
using Api.Common.Types;
using Core.Consultants;
using Core.PersonnelTeam;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Api.Consultants;

[Authorize]
[Route("/v0/{orgUrlKey}/personnelTeams")]
[ApiController]
public class PersonnelTeamController(
    IPersonnelTeamRepository personnelTeamRepository, IConsultantRepository consultantRepository) : ControllerBase
{
    [HttpGet]
    [Route("{personnelTeamId:int}")]
    public async Task<ActionResult<PersonnelTeamReadModel>> GetPersonnelTeamById([FromRoute] string orgUrlKey,
        [FromRoute(Name = "personnelTeamId")] int personnelTeamId,
        CancellationToken cancellationToken)
    {
        var leader = await personnelTeamRepository.GetLeaderByPersonnelTeamId(personnelTeamId, cancellationToken);

        if (leader is null) return NotFound($"No leader found with connection to personnelTeamId {personnelTeamId}");

        var personnelTeam = new PersonnelTeam
        {
            Id = personnelTeamId,
            LeaderId = leader.Id,
            OrganizationUrlKey = orgUrlKey
        };

        return Ok(PersonnelTeamReadModel.Create(personnelTeam));
    }

    [HttpGet]
    [Route("{personnelTeamId:int}/members")]
    public async Task<ActionResult<List<SingleConsultantReadModel>>> GetMembersByPersonnelTeamId(
        [FromRoute] string orgUrlKey,
        [FromRoute(Name = "personnelTeamId")] int personnelTeamId,
        CancellationToken cancellationToken)
    {
        var members =
            await personnelTeamRepository.GetMembersByPersonnelTeamId(orgUrlKey, personnelTeamId, cancellationToken);

        if (members.IsNullOrEmpty()) return NotFound();

        var readModels = members
            .Select(c => new SingleConsultantReadModel(c))
            .ToList();

        return Ok(readModels);
    }

    [HttpGet]
    public async Task<OkObjectResult> GetAllPersonnelTeamsInOrg([FromRoute] string orgUrlKey,
        CancellationToken cancellationToken)
    {
        var personnelTeams =
            await consultantRepository.GetPersonnelTeamsInOrganizationByUrlKey(orgUrlKey, cancellationToken);

        var readModels = personnelTeams
            .Select(PersonnelTeamReadModel.Create)
            .DefaultIfEmpty();

        return Ok(readModels);
    }

    [HttpPost]
    public async Task<ActionResult<int>> CreatePersonnelTeam([FromRoute] string orgUrlKey,
        [FromQuery] int leaderId,
        CancellationToken cancellationToken)
    {
        var leader = await consultantRepository.GetConsultantById(leaderId, cancellationToken);

        if (leader is null)
            return NotFound($"Consultant with id {leaderId} not found, cannot create personnel team without a leader");

        var allPersonnelTeams =
            await consultantRepository.GetPersonnelTeamsInOrganizationByUrlKey(orgUrlKey, cancellationToken);
        var personnelTeamAlreadyExists = allPersonnelTeams.Exists(m => m.LeaderId == leaderId);

        if (personnelTeamAlreadyExists)
            return Conflict($"PersonnelTeam with leaderId {leaderId} already exists in organization {orgUrlKey}");

        var personnelTeamId = await personnelTeamRepository.CreatePersonnelTeam(orgUrlKey, leaderId, cancellationToken);

        return Ok(personnelTeamId);
    }

    [HttpDelete]
    [Route("{personnelTeamId:int}")]
    public async Task<IResult> DeletePersonnelTeam([FromRoute(Name = "personnelTeamId")] int personnelTeamId,
        CancellationToken cancellationToken)
    {
        return await personnelTeamRepository.DeletePersonnelTeam(personnelTeamId, cancellationToken);
    }
}
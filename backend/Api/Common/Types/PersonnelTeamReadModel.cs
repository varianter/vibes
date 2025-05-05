using Core.PersonnelTeam;

namespace Api.Common.Types;

public record PersonnelTeamReadModel(int Id, int LeaderId, string OrgUrlKey) 
{
    public static PersonnelTeamReadModel? Create(PersonnelTeam? personnelTeam) =>
        personnelTeam is null
            ? null
            : new PersonnelTeamReadModel(personnelTeam.Id, personnelTeam.LeaderId, personnelTeam.OrganizationUrlKey);
}
using Microsoft.AspNetCore.Http;

namespace Core.Consultants;

public interface IConsultantRepository
{
    /**
     * Get consultant, including common Department, Organization and Competence-data
     */
    Task<Consultant?> GetConsultantById(int id, CancellationToken cancellationToken);

    /**
    * Get consultant, including common Department, Organization and Competence-data
    */
    Task<Consultant?> GetConsultantByEmail(string orgUrlKey, string email, CancellationToken cancellationToken);

    Task<List<Consultant>> GetConsultantsInOrganizationByUrlKey(string urlKey, CancellationToken cancellationToken);
    
    Task<Consultant?> UpdateDiscipline(int consultantId, string? disciplineId, CancellationToken cancellationToken);
    
    Task<List<PersonnelTeam.PersonnelTeam>> GetPersonnelTeamsInOrganizationByUrlKey(string urlKey, CancellationToken cancellationToken);
    Task<IResult> UpdatePersonnelTeamByConsultantId(int consultantId, int? personnelTeamId, CancellationToken cancellationToken);
}
namespace Core.Consultants;

public interface IConsultantRepository
{
    /**
     * Get consultant, including common Department, Organization and Competense-data
     */
    Task<Consultant?> GetConsultantById(int id, CancellationToken ct);

    /**
    * Get consultant, including common Department, Organization and Competense-data
    */
    Task<Consultant?> GetConsultantByEmail(string orgUrlKey, string email, CancellationToken ct);

    Task<List<Consultant>> GetConsultantsInOrganizationByUrlKey(string urlKey, CancellationToken ct);
}
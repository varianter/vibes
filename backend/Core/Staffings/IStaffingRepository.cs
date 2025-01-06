namespace Core.Staffings;

public interface IStaffingRepository
{
    public Task<Dictionary<int, List<Staffing>>> GetStaffingForConsultants(List<int> consultantIds,
        CancellationToken cancellationToken);

    public Task<List<Staffing>> GetStaffingForConsultant(int consultantId, CancellationToken cancellationToken);

    public Task UpsertStaffing(Staffing staffing, CancellationToken cancellationToken);

    public Task UpsertMultipleStaffings(List<Staffing> staffings, CancellationToken cancellationToken);
}
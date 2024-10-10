namespace Core.Staffings;

public interface IStaffingRepository
{
    public Task<Dictionary<int, List<Staffing>>> GetStaffingForConsultants(List<int> consultantIds,
        CancellationToken ct);

    public Task<List<Staffing>> GetStaffingForConsultant(int consultantId, CancellationToken ct);

    public Task UpsertStaffing(Staffing staffing, CancellationToken ct);

    public Task UpsertMultipleStaffings(List<Staffing> staffings, CancellationToken ct);
}
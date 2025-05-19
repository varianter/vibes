using Core.Weeks;

namespace Core.Staffings;

public interface IStaffingRepository
{
    public Task<Dictionary<int, List<Staffing>>> GetStaffingForConsultants(List<int> consultantIds,
        CancellationToken cancellationToken);

    public Task<List<Staffing>> GetStaffingForConsultant(int consultantId, CancellationToken cancellationToken);
    
    public Task<List<Staffing>> GetStaffingForConsultantForWeekSet(int consultantId, CancellationToken cancellationToken, List<Week> weeks);

    public Task UpsertStaffing(Staffing staffing, CancellationToken cancellationToken);

    public Task UpsertMultipleStaffings(List<Staffing> staffings, CancellationToken cancellationToken);
}
namespace Core.PlannedAbsences;

public interface IPlannedAbsenceRepository
{
    public Task<Dictionary<int, List<PlannedAbsence>>> GetPlannedAbsenceForConsultants(List<int> consultantIds,
        CancellationToken ct);

    public Task<List<PlannedAbsence>> GetPlannedAbsenceForConsultant(int consultantId, CancellationToken ct);

    public Task UpsertPlannedAbsence(PlannedAbsence plannedAbsence, CancellationToken ct);

    public Task UpsertMultiplePlannedAbsences(List<PlannedAbsence> plannedAbsences, CancellationToken ct);
}
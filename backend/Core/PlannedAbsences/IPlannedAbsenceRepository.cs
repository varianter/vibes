namespace Core.PlannedAbsences;

public interface IPlannedAbsenceRepository
{
    public Task<Dictionary<int, List<PlannedAbsence>>> GetPlannedAbsenceForConsultants(List<int> consultantIds,
        CancellationToken cancellationToken);

    public Task<List<PlannedAbsence>> GetPlannedAbsenceForConsultant(int consultantId,
        CancellationToken cancellationToken);

    public Task UpsertPlannedAbsence(PlannedAbsence plannedAbsence, CancellationToken cancellationToken);

    public Task UpsertMultiplePlannedAbsences(List<PlannedAbsence> plannedAbsences,
        CancellationToken cancellationToken);
}
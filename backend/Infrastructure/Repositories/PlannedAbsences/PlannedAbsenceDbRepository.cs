using Core.PlannedAbsences;
using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.PlannedAbsences;

public class PlannedAbsenceDbRepository(ApplicationContext context) : IPlannedAbsenceRepository
{
    public async Task<Dictionary<int, List<PlannedAbsence>>> GetPlannedAbsenceForConsultants(List<int> consultantIds,
        CancellationToken ct)
    {
        var ids = consultantIds.ToArray();
        return await context.PlannedAbsence
            .Where(pa => ids.Contains(pa.ConsultantId))
            .Include(absence => absence.Absence)
            .Include(absence => absence.Consultant)
            .GroupBy(absence => absence.Consultant.Id)
            .ToDictionaryAsync(grouping => grouping.Key, grouping => grouping.ToList(), ct);
    }

    public async Task<List<PlannedAbsence>> GetPlannedAbsenceForConsultant(int consultantId, CancellationToken ct)
    {
        return await context.PlannedAbsence
            .Where(pa => pa.ConsultantId == consultantId)
            .Include(absence => absence.Absence)
            .Include(absence => absence.Consultant)
            .ToListAsync(ct);
    }

    public async Task UpsertPlannedAbsence(PlannedAbsence plannedAbsence, CancellationToken ct)
    {
        var existingPlannedAbsence = context.PlannedAbsence
            .FirstOrDefault(pa => pa.AbsenceId.Equals(plannedAbsence.AbsenceId)
                                  && pa.ConsultantId.Equals(plannedAbsence.ConsultantId)
                                  && pa.Week.Equals(plannedAbsence.Week));

        if (existingPlannedAbsence is null)
            await context.PlannedAbsence.AddAsync(plannedAbsence, ct);
        else
            existingPlannedAbsence.Hours = plannedAbsence.Hours;

        await context.SaveChangesAsync(ct);
    }

    public async Task UpsertMultiplePlannedAbsences(List<PlannedAbsence> plannedAbsences, CancellationToken ct)
    {
        foreach (var absence in plannedAbsences) await UpsertPlannedAbsence(absence, ct);
    }
}
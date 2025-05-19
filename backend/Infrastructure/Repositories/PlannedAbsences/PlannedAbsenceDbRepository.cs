using Core.PlannedAbsences;
using Core.Weeks;
using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.PlannedAbsences;

public class PlannedAbsenceDbRepository(ApplicationContext context) : IPlannedAbsenceRepository
{
    public async Task<Dictionary<int, List<PlannedAbsence>>> GetPlannedAbsenceForConsultants(List<int> consultantIds,
        CancellationToken cancellationToken)
    {
        var ids = consultantIds.ToArray();
        return await context.PlannedAbsence
            .Where(pa => ids.Contains(pa.ConsultantId) && pa.Consultant != null)
            .Include(absence => absence.Absence)
            .Include(absence => absence.Consultant)
            .GroupBy(absence => absence.Consultant!.Id)
            .ToDictionaryAsync(grouping => grouping.Key, grouping => grouping.ToList(), cancellationToken);
    }

    public async Task<List<PlannedAbsence>> GetPlannedAbsenceForConsultant(int consultantId,
        CancellationToken cancellationToken)
    {
        return await context.PlannedAbsence
            .Where(pa => pa.ConsultantId == consultantId)
            .Include(absence => absence.Absence)
            .Include(absence => absence.Consultant)
            .ToListAsync(cancellationToken);
    }
    
    public async Task<List<PlannedAbsence>> GetPlannedAbsenceForConsultantForWeekSet(int consultantId,
        CancellationToken cancellationToken, List<Week> weeks)
    {
        return await context.PlannedAbsence
            .Where(pa => pa.ConsultantId == consultantId && weeks.Contains(pa.Week))
            .Include(absence => absence.Absence)
            .Include(absence => absence.Consultant)
            .ToListAsync(cancellationToken);
    }

    public async Task UpsertPlannedAbsence(PlannedAbsence plannedAbsence, CancellationToken cancellationToken)
    {
        var existingPlannedAbsence = await context.PlannedAbsence
            .FirstOrDefaultAsync(pa => pa.AbsenceId.Equals(plannedAbsence.AbsenceId)
                                       && pa.ConsultantId.Equals(plannedAbsence.ConsultantId)
                                       && pa.Week.Equals(plannedAbsence.Week), cancellationToken);

        if (existingPlannedAbsence is null)
            await context.PlannedAbsence.AddAsync(plannedAbsence, cancellationToken);
        else
            existingPlannedAbsence.Hours = plannedAbsence.Hours;

        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpsertMultiplePlannedAbsences(List<PlannedAbsence> plannedAbsences,
        CancellationToken cancellationToken)
    {
        foreach (var absence in plannedAbsences) await UpsertPlannedAbsence(absence, cancellationToken);
    }
}
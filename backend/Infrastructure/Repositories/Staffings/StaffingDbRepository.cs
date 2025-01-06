using Core.Staffings;
using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Staffings;

public class StaffingDbRepository(ApplicationContext context) : IStaffingRepository
{
    public async Task<Dictionary<int, List<Staffing>>> GetStaffingForConsultants(List<int> consultantIds,
        CancellationToken cancellationToken)
    {
        var ids = consultantIds.ToArray();

        return await context.Staffing
            .Where(s => ids.Contains(s.ConsultantId))
            .Include(s => s.Consultant)
            .Include(staffing => staffing.Engagement)
            .ThenInclude(project => project.Customer)
            .Include(staffing => staffing.Engagement)
            .ThenInclude(project => project.Agreements)
            .GroupBy(staffing => staffing.Consultant!.Id)
            .ToDictionaryAsync(group => group.Key, grouping => grouping.ToList(), cancellationToken);
    }

    public async Task<List<Staffing>> GetStaffingForConsultant(int consultantId, CancellationToken cancellationToken)
    {
        return await context.Staffing
            .Where(staffing => staffing.ConsultantId == consultantId)
            .Include(s => s.Engagement)
            .ThenInclude(p => p.Customer)
            .ToListAsync(cancellationToken);
    }


    public async Task UpsertMultipleStaffings(List<Staffing> staffings, CancellationToken cancellationToken)
    {
        foreach (var staffing in staffings) await UpsertStaffing(staffing, cancellationToken);
    }

    public async Task UpsertStaffing(Staffing staffing, CancellationToken cancellationToken)
    {
        var existingStaffing = await context.Staffing
            .FirstOrDefaultAsync(s => s.EngagementId.Equals(staffing.EngagementId)
                                      && s.ConsultantId.Equals(staffing.ConsultantId)
                                      && s.Week.Equals(staffing.Week), cancellationToken);

        if (existingStaffing is null)
            await context.Staffing.AddAsync(staffing, cancellationToken);
        else
            existingStaffing.Hours = staffing.Hours;

        await context.SaveChangesAsync(cancellationToken);
    }
}
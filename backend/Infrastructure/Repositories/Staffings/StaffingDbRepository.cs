using Core.Staffings;
using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Staffings;

public class StaffingDbRepository(ApplicationContext context) : IStaffingRepository
{
    public async Task<List<Staffing>> GetStaffingForConsultant(int consultantId, CancellationToken ct)
    {
        return await context.Staffing
            .Where(staffing => staffing.ConsultantId == consultantId)
            .Include(s => s.Engagement)
            .ThenInclude(p => p.Customer)
            .ToListAsync(ct);
    }


    public async Task UpsertMultipleStaffings(List<Staffing> staffings, CancellationToken ct)
    {
        foreach (var staffing in staffings) await UpsertStaffing(staffing, ct);
    }

    public async Task UpsertStaffing(Staffing staffing, CancellationToken ct)
    {
        var existingStaffing = context.Staffing
            .FirstOrDefault(s => s.EngagementId.Equals(staffing.EngagementId)
                                 && s.ConsultantId.Equals(staffing.ConsultantId)
                                 && s.Week.Equals(staffing.Week));

        if (existingStaffing is null)
        {
            await context.Staffing.AddAsync(staffing, ct);
            return;
        }

        existingStaffing.Hours = staffing.Hours;
        await context.SaveChangesAsync(ct);
    }
}
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
        var upsertJobs = staffings.Select<Staffing, Task>(async staffing => await UpsertStaffing(staffing, ct));

        await Task.WhenAll(upsertJobs);
    }

    public async Task UpsertStaffing(Staffing staffing, CancellationToken ct)
    {
        var existingStaffing =
            await context.Staffing.FindAsync(
                new StaffingKey(staffing.EngagementId, staffing.ConsultantId, staffing.Week), ct);

        if (existingStaffing is null)
        {
            await context.Staffing.AddAsync(staffing, ct);
            return;
        }

        existingStaffing.Hours = staffing.Hours;
        await context.SaveChangesAsync(ct);
    }
}
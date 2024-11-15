using Core.Agreements;
using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class AgreementDbRepository(ApplicationContext context) : IAgreementsRepository
{
    public Task<Core.Agreements.Agreement?> GetAgreementById(int id, CancellationToken cancellationToken)
    {
        return context.Agreements
            .Include(p => p.Files)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public Task<Core.Agreements.Agreement?> GetAgreementByEngagementId(int engagementId, CancellationToken cancellationToken)
    {
        return context.Agreements
            .Include(p => p.Files)
            .FirstOrDefaultAsync(p => p.EngagementId == engagementId, cancellationToken);
    }

    public async Task AddAgreementAsync(Agreement agreement, CancellationToken cancellationToken)
    {
        context.Agreements.Add(agreement);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAgreementAsync(Agreement agreement, CancellationToken cancellationToken)
    {
        context.Agreements.Update(agreement);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAgreementAsync(int id, CancellationToken cancellationToken)
    {
        var agreement = await context.Agreements.FindAsync(id);
        if (agreement != null)
        {
            context.Agreements.Remove(agreement);
            await context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<List<string?>> GetPriceAdjustmentIndexesAsync(CancellationToken cancellationToken)
    {
        var priceAdjustmentIndexes = await context.Agreements
            .Select(p => p.PriceAdjustmentIndex)
            .Distinct()
            .ToListAsync(cancellationToken);

        return priceAdjustmentIndexes;
    }
}
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

    public Task<List<Core.Agreements.Agreement>> GetAgreementsByEngagementId(int engagementId, CancellationToken cancellationToken)
    {
        return context.Agreements
            .Include(p => p.Files)
            .Where(p => p.EngagementId == engagementId)
            .ToListAsync(cancellationToken);
    }

    public Task<List<Core.Agreements.Agreement>> GetAgreementsByCustomerId(int customerId, CancellationToken cancellationToken)
    {
        return context.Agreements
            .Include(p => p.Files)
            .Where(p => p.CustomerId == customerId)
            .ToListAsync(cancellationToken);
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
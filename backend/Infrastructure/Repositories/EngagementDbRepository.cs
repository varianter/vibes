using Core.Engagements;
using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class EngagementDbRepository(ApplicationContext context) : IEngagementRepository
{
    public Task<Engagement?> GetEngagementById(int id, CancellationToken cancellationToken)
    {
        return context.Project
            .AsNoTracking()
            .Include(p => p.Customer)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }
}
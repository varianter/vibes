using Core.Engagements;
using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Engagement;

public class EngagementDbRepository(ApplicationContext context) : IEngagementRepository
{
    public Task<Core.Engagements.Engagement?> GetEngagementById(int id, CancellationToken cancellationToken)
    {
        return context.Project
            .Include(p => p.Customer)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }
}
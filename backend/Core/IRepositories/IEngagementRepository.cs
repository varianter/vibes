using Core.DomainModels;

namespace Core.IRepositories;

public interface IEngagementRepository
{
    public Task<Engagement?> GetEngagementById(int id, CancellationToken cancellationToken);
}
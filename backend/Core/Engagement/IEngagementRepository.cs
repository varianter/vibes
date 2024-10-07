namespace Core.Engagement;

public interface IEngagementRepository
{
    public Task<Engagement?> GetEngagementById(int id, CancellationToken cancellationToken);
}
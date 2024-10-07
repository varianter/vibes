using Core.DomainModels;

namespace Core.IRepositories;

public interface IEngagementRepository
{
    public Engagement? GetEngagementById(int id);
}
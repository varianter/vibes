namespace Core.Agreements;

public interface IAgreementsRepository
{
    public Task<Agreement?> GetAgreementById(int id, CancellationToken cancellationToken);

    public Task<Agreement?> GetAgreementByEngagementId(int engagementId, CancellationToken cancellationToken);

    public Task AddAgreementAsync(Agreement agreement, CancellationToken cancellationToken);

    public Task UpdateAgreementAsync(Agreement agreement, CancellationToken cancellationToken);

    public Task DeleteAgreementAsync(int id, CancellationToken cancellationToken);

}
namespace Core.Agreements;

public interface IAgreementsRepository
{
    public Task<Agreement?> GetAgreementById(int id, CancellationToken cancellationToken);

    public Task<List<Agreement>> GetAgreementsByEngagementId(int engagementId, CancellationToken cancellationToken);
    public Task<List<Agreement>> GetAgreementsByCustomerId(int customerId, CancellationToken cancellationToken);
    public Task<List<int>> GetConsultantIdsRelatedToAgreementId(int agreementId, CancellationToken cancellationToken);
    public Task AddAgreementAsync(Agreement agreement, CancellationToken cancellationToken);

    public Task UpdateAgreementAsync(Agreement agreement, CancellationToken cancellationToken);

    public Task DeleteAgreementAsync(int id, CancellationToken cancellationToken);

    public Task<List<string?>> GetPriceAdjustmentIndexesAsync(CancellationToken cancellationToken);

}
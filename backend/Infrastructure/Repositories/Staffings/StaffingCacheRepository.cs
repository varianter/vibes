using Core.Staffings;
using Microsoft.Extensions.Caching.Memory;

namespace Infrastructure.Repositories.Staffings;

public class StaffingCacheRepository(IStaffingRepository sourceRepository, IMemoryCache cache) : IStaffingRepository
{
    public async Task<List<Staffing>> GetStaffingForConsultant(int consultantId, CancellationToken ct)
    {
        if (cache.TryGetValue<List<Staffing>>(StaffingCacheKey(consultantId), out var staffingList))
            if (staffingList is not null)
            {
                Console.Out.WriteLineAsync($"Cache hit, ID: {consultantId}");
                return staffingList;
            }

        staffingList = await sourceRepository.GetStaffingForConsultant(consultantId, ct);
        cache.Set(StaffingCacheKey(consultantId), staffingList);
        return staffingList;
    }

    public async Task UpsertStaffing(Staffing staffing, CancellationToken ct)
    {
        await sourceRepository.UpsertStaffing(staffing, ct);
        ClearStaffingCache(staffing.ConsultantId);
    }

    public async Task UpsertMultipleStaffings(List<Staffing> staffings, CancellationToken ct)
    {
        await sourceRepository.UpsertMultipleStaffings(staffings, ct);

        var consultantIds = staffings.Select(staffing => staffing.ConsultantId).Distinct();
        foreach (var consultantId in consultantIds) ClearStaffingCache(consultantId);
    }

    private void ClearStaffingCache(int consultantId)
    {
        cache.Remove(StaffingCacheKey(consultantId));
    }

    private static string StaffingCacheKey(int consultantId)
    {
        return $"StaffingCacheRepository/{consultantId}";
    }
}
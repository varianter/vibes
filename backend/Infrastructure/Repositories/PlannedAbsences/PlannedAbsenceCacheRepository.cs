using Core.PlannedAbsences;
using Microsoft.Extensions.Caching.Memory;

namespace Infrastructure.Repositories.PlannedAbsences;

public class PlannedAbsenceCacheRepository(IPlannedAbsenceRepository sourceRepository, IMemoryCache cache) : IPlannedAbsenceRepository
{
    public async Task<Dictionary<int, List<PlannedAbsence>>> GetPlannedAbsenceForConsultants(List<int> consultantIds, CancellationToken ct)
    {
        var nonCachedIds = new List<int>();
        var result = new Dictionary<int, List<PlannedAbsence>>();

        foreach (var consultantId in consultantIds.Distinct())
        {
            var plannedAbsenceList = GetPlannedAbsencesFromCache(consultantId);
            if (plannedAbsenceList is null)
                nonCachedIds.Add(consultantId);
            else
                result.Add(consultantId, plannedAbsenceList);
        }

        var queriedPlannedAbsenceLists = await sourceRepository.GetPlannedAbsenceForConsultants(nonCachedIds, ct);
        foreach (var (cId, plannedAbsences) in queriedPlannedAbsenceLists)
        {
            result.Add(cId, plannedAbsences);
            cache.Set(PlannedAbsenceCacheKey(cId), plannedAbsences);
        }

        return result;
    }

    public async Task<List<PlannedAbsence>> GetPlannedAbsenceForConsultant(int consultantId, CancellationToken ct)
    {
        var plannedAbsenceList = GetPlannedAbsencesFromCache(consultantId);
        if (plannedAbsenceList is not null) return plannedAbsenceList;

        plannedAbsenceList = await sourceRepository.GetPlannedAbsenceForConsultant(consultantId, ct);
        cache.Set(PlannedAbsenceCacheKey(consultantId), plannedAbsenceList);
        return plannedAbsenceList;
    }

    public async Task UpsertPlannedAbsence(PlannedAbsence plannedAbsence, CancellationToken ct)
    {
        await sourceRepository.UpsertPlannedAbsence(plannedAbsence, ct);
        ClearPlannedAbsenceCache(plannedAbsence.ConsultantId);
    }

    public async Task UpsertMultiplePlannedAbsences(List<PlannedAbsence> plannedAbsences, CancellationToken ct)
    {
        await sourceRepository.UpsertMultiplePlannedAbsences(plannedAbsences, ct);
        
        var consultantIds = plannedAbsences.Select(pa => pa.ConsultantId).Distinct();
        foreach (var consultantId in consultantIds) ClearPlannedAbsenceCache(consultantId);
        
    }
    
    private List<PlannedAbsence>? GetPlannedAbsencesFromCache(int consultantId)
    {
        if (cache.TryGetValue<List<PlannedAbsence>>(PlannedAbsenceCacheKey(consultantId), out var plannedAbsenceList))
            if (plannedAbsenceList is not null)
                return plannedAbsenceList;

        return null;
    }

    private void ClearPlannedAbsenceCache(int consultantId)
    {
        cache.Remove(PlannedAbsenceCacheKey(consultantId));
    }

    private static string PlannedAbsenceCacheKey(int consultantId)
    {
        return $"PlannedAbsenceCacheRepository/{consultantId}";
    }
}
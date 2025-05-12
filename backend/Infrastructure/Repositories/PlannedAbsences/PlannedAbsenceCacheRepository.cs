using Core.Extensions;
using Core.PlannedAbsences;
using Microsoft.Extensions.Caching.Memory;

namespace Infrastructure.Repositories.PlannedAbsences;

// ReSharper disable once ClassNeverInstantiated.Global
public class PlannedAbsenceCacheRepository(IPlannedAbsenceRepository sourceRepository, IMemoryCache cache) : IPlannedAbsenceRepository
{
    public async Task<Dictionary<int, List<PlannedAbsence>>> GetPlannedAbsenceForConsultants(List<int> consultantIds,
        CancellationToken cancellationToken)
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

        var queriedPlannedAbsenceLists =
            await sourceRepository.GetPlannedAbsenceForConsultants(nonCachedIds, cancellationToken);
        foreach (var (cId, plannedAbsences) in queriedPlannedAbsenceLists)
        {
            result.Add(cId, plannedAbsences);
            cache.SetPlannedAbsenceFor(cId, plannedAbsences);
        }

        return result;
    }

    public async Task<List<PlannedAbsence>> GetPlannedAbsenceForConsultant(int consultantId,
        CancellationToken cancellationToken)
    {
        var plannedAbsenceList = GetPlannedAbsencesFromCache(consultantId);
        if (plannedAbsenceList is not null) return plannedAbsenceList;

        plannedAbsenceList = await sourceRepository.GetPlannedAbsenceForConsultant(consultantId, cancellationToken);
        cache.SetPlannedAbsenceFor(consultantId, plannedAbsenceList);
        return plannedAbsenceList;
    }

    public async Task UpsertPlannedAbsence(PlannedAbsence plannedAbsence, CancellationToken cancellationToken)
    {
        await sourceRepository.UpsertPlannedAbsence(plannedAbsence, cancellationToken);
        cache.ClearPlannedAbsenceFor(plannedAbsence.ConsultantId);
    }

    public async Task UpsertMultiplePlannedAbsences(List<PlannedAbsence> plannedAbsences,
        CancellationToken cancellationToken)
    {
        await sourceRepository.UpsertMultiplePlannedAbsences(plannedAbsences, cancellationToken);
        
        var consultantIds = plannedAbsences.Select(pa => pa.ConsultantId).Distinct();
        foreach (var consultantId in consultantIds) cache.ClearPlannedAbsenceFor(consultantId);
        
    }
    
    private List<PlannedAbsence>? GetPlannedAbsencesFromCache(int consultantId)
    {
        if (cache.TryGetPlannedAbsenceFor(consultantId, out var plannedAbsenceList) &&
            plannedAbsenceList is not null) return plannedAbsenceList;

        return null;
    }
}
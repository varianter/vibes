using Core.Extensions;
using Core.Staffings;
using Core.Weeks;
using Microsoft.Extensions.Caching.Memory;

namespace Infrastructure.Repositories.Staffings;

public class StaffingCacheRepository(IStaffingRepository sourceRepository, IMemoryCache cache) : IStaffingRepository
{
    public async Task<Dictionary<int, List<Staffing>>> GetStaffingForConsultants(List<int> consultantIds,
        CancellationToken cancellationToken)
    {
        Console.WriteLine($"CACHE GetStaffingForConsultants (count: {consultantIds.Count})");
        var nonCachedIds = new List<int>();
        var result = new Dictionary<int, List<Staffing>>();

        foreach (var consultantId in consultantIds.Distinct())
        {
            var staffingList = GetStaffingsFromCache(consultantId);
            if (staffingList is null)
                nonCachedIds.Add(consultantId);
            else
                result.Add(consultantId, staffingList);
        }

        var queriedStaffingLists = await sourceRepository.GetStaffingForConsultants(nonCachedIds, cancellationToken);
        foreach (var (cId, staffings) in queriedStaffingLists)
        {
            result.Add(cId, staffings);
            cache.SetStaffingFor(cId, staffings);
        }

        return result;
    }

    public async Task<List<Staffing>> GetStaffingForConsultant(int consultantId, CancellationToken cancellationToken)
    {
        var staffingList = GetStaffingsFromCache(consultantId);
        if (staffingList is not null) return staffingList;

        staffingList = await sourceRepository.GetStaffingForConsultant(consultantId, cancellationToken);
        cache.SetStaffingFor(consultantId, staffingList);
        return staffingList;
    }
    
    public async Task<List<Staffing>> GetStaffingForConsultantForWeekSet(int consultantId, CancellationToken cancellationToken, List<Week> weeks)
    {
        var staffingList = GetStaffingsFromCache(consultantId);
        if (staffingList is not null) return staffingList;

        staffingList = await sourceRepository.GetStaffingForConsultantForWeekSet(consultantId, cancellationToken, weeks);
        
        return staffingList;
    }

    public async Task UpsertStaffing(Staffing staffing, CancellationToken cancellationToken)
    {
        Console.WriteLine($"CACHE UpsertStaffing for consultant #{staffing.ConsultantId}");
        await sourceRepository.UpsertStaffing(staffing, cancellationToken);
        cache.ClearStaffingFor(staffing.ConsultantId);
    }

    public async Task UpsertMultipleStaffings(List<Staffing> staffings, CancellationToken cancellationToken)
    {
        Console.WriteLine($"CACHE UpsertMultipleStaffings (count: {staffings.Count})");
        await sourceRepository.UpsertMultipleStaffings(staffings, cancellationToken);

        var consultantIds = staffings.Select(staffing => staffing.ConsultantId).Distinct().ToList();
        cache.ClearStaffingFor(consultantIds);
    }

    private List<Staffing>? GetStaffingsFromCache(int consultantId)
    {
        if (cache.TryGetStaffingFor(consultantId, out var staffingList))
            if (staffingList is not null)
                return staffingList;

        return null;
    }
}
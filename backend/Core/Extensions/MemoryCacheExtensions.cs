using Core.Consultants;
using Core.PlannedAbsences;
using Core.Staffings;
using Microsoft.Extensions.Caching.Memory;

namespace Core.Extensions;

public static class MemoryCacheExtensions
{
	public static void ClearConsultantCache(this IMemoryCache cache, string orgUrlKey)
	{
		cache.Remove(ConsultantCacheKey(orgUrlKey));
	}

	public static void SetConsultantCache(this IMemoryCache cache, string orgUrlKey, List<Consultant> consultants)
	{
		cache.Set(ConsultantCacheKey(orgUrlKey), consultants);
	}

	public static bool TryGetFromConsultantCache(this IMemoryCache cache, string orgUrlKey, out List<Consultant>? consultants)
	{
		return cache.TryGetValue(ConsultantCacheKey(orgUrlKey), out consultants);
	}

	public static void ClearPlannedAbsenceFor(this IMemoryCache cache, int consultantId)
	{
		cache.Remove(PlannedAbsenceCacheKey(consultantId));
	}

	public static void SetPlannedAbsenceFor(this IMemoryCache cache, int consultantId, List<PlannedAbsence>? plannedAbsences)
	{
		cache.Set(PlannedAbsenceCacheKey(consultantId), plannedAbsences);
	}

	public static bool TryGetPlannedAbsenceFor(this IMemoryCache cache, int consultantId, out List<PlannedAbsence>? plannedAbsences)
	{
		return cache.TryGetValue(PlannedAbsenceCacheKey(consultantId), out plannedAbsences);
	}

	public static void ClearStaffingFor(this IMemoryCache cache, int consultantId)
	{
		cache.Remove(StaffingCacheKey(consultantId));
	}

	public static void ClearStaffingFor(this IMemoryCache cache, List<int> consultantIds)
	{
		foreach (var consultantId in consultantIds)
		{
			cache.ClearStaffingFor(consultantId);
		}
	}

	public static void SetStaffingFor(this IMemoryCache cache, int consultantId, List<Staffing>? staffings)
	{
		cache.Set(StaffingCacheKey(consultantId), staffings);
	}

	public static bool TryGetStaffingFor(this IMemoryCache cache, int consultantId, out List<Staffing>? staffings)
	{
		return cache.TryGetValue(StaffingCacheKey(consultantId), out staffings);
	}

	private static string ConsultantCacheKey(string orgUrlKey) => $"consultantCacheKey/{orgUrlKey}";

	private static string PlannedAbsenceCacheKey(int consultantId) => $"PlannedAbsenceCacheRepository/{consultantId}";

	private static string StaffingCacheKey(int consultantId) => $"StaffingCacheRepository/{consultantId}";
}

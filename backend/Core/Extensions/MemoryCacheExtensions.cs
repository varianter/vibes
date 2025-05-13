using Microsoft.Extensions.Caching.Memory;

namespace Core.Extensions;

public static class MemoryCacheExtensions
{
	public static void ClearConsultantCache(this IMemoryCache cache, string orgUrlKey)
	{
		cache.Remove(ConsultantCacheKey(orgUrlKey));
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

	private static string ConsultantCacheKey(string orgUrlKey) => $"consultantCacheKey/{orgUrlKey}";

	private static string StaffingCacheKey(int consultantId) => $"StaffingCacheRepository/{consultantId}";
}

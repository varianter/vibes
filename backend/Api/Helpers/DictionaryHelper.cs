namespace Api.Helpers;

public static class DictionaryHelper
{
	public static List<T> GetFromDictOrDefault<T>(int key, Dictionary<int, List<T>> dict)
	{
		if (dict.TryGetValue(key, out var value) && value is not null)
		{
			return value;
		}

		return [];
	}
}

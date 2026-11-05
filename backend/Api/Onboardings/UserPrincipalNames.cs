using System.Globalization;
using System.Text;

namespace Api.Onboardings;

/// <summary>
///     Login names for new users: first name and last name with a dot between, e.g. kari.nordmann@variant.no.
/// </summary>
public static class UserPrincipalNames
{
    private const int MaxNumberSuffix = 9;

    /// <summary>
    ///     Login names to try in order: the plain name first, then with a number when it is taken
    ///     (kari.nordmann, kari.nordmann2, ... kari.nordmann9).
    /// </summary>
    public static IEnumerable<string> Candidates(string fullName, string domain)
    {
        var localPart = LocalPart(fullName);
        if (localPart == "") yield break;

        yield return $"{localPart}@{domain}";
        for (var number = 2; number <= MaxNumberSuffix; number++)
            yield return $"{localPart}{number}@{domain}";
    }

    /// <summary>First and last word of the name, e.g. "Kari Anne Nordmann" gives "kari.nordmann"</summary>
    public static string LocalPart(string fullName)
    {
        var names = fullName
            .Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(Normalize)
            .Where(name => name != "")
            .ToList();

        return names.Count switch
        {
            0 => "",
            1 => names[0],
            _ => $"{names[0]}.{names[^1]}"
        };
    }

    private static string Normalize(string name)
    {
        var lower = name.ToLowerInvariant()
            .Replace("æ", "ae")
            .Replace("ø", "o")
            .Replace("å", "a");

        // Strip accents (é -> e) and anything not allowed in a login name
        var builder = new StringBuilder();
        foreach (var c in lower.Normalize(NormalizationForm.FormD))
        {
            if (CharUnicodeInfo.GetUnicodeCategory(c) == UnicodeCategory.NonSpacingMark) continue;
            if (c is >= 'a' and <= 'z' or >= '0' and <= '9' or '-') builder.Append(c);
        }

        return builder.ToString().Trim('-');
    }
}

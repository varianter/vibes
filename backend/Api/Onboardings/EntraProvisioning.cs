using System.Security.Cryptography;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using Microsoft.Graph.Models.ODataErrors;
using Microsoft.Graph.Users.Item.AssignLicense;

namespace Api.Onboardings;

/// <summary>
///     Settings for creating users in Entra ID / O365 during onboarding (section "EntraProvisioning").
///     Off unless Enabled is true.
/// </summary>
public class EntraProvisioningConfig
{
    public bool Enabled { get; set; }

    /// <summary>Use a fake provisioner that never calls Graph. Only allowed in Local and Development.</summary>
    public bool Mock { get; set; }

    /// <summary>Domain of the login name, e.g. kari.nordmann@variant.no</summary>
    public string Domain { get; set; } = "variant.no";

    /// <summary>License to assign, e.g. f245ecc8-75af-4f8e-b61f-27d8114de5f3 (Microsoft 365 Business Standard)</summary>
    public string? LicenseSkuId { get; set; }

    /// <summary>Entra groups the new user is added to</summary>
    public List<string> GroupIds { get; set; } = [];

    public string UsageLocation { get; set; } = "NO";

    public int PollIntervalSeconds { get; set; } = 10;
}

/// <param name="DisplayName">Full name; the login name is made from the first and last name</param>
public record EntraUserRequest(string DisplayName, string? Department, DateOnly? HireDate);

/// <param name="UserId">Set when the user was created, also when a later part (license, groups) failed</param>
/// <param name="Message">Shown on the status page to users with the onboarding role. Never logged.</param>
/// <param name="UserPrincipalName">Login name and O365 email of the created user</param>
public record EntraProvisioningResult(
    bool Succeeded,
    string? UserId,
    string? Message,
    string? UserPrincipalName = null)
{
    public static EntraProvisioningResult Success(string userId, string userPrincipalName)
    {
        return new EntraProvisioningResult(true, userId, $"Opprettet som {userPrincipalName}", userPrincipalName);
    }

    public static EntraProvisioningResult Failure(string message, string? userId = null)
    {
        return new EntraProvisioningResult(false, userId, message);
    }
}

public interface IEntraUserProvisioner
{
    Task<EntraProvisioningResult> CreateUser(EntraUserRequest request, CancellationToken cancellationToken);
}

/// <summary>
///     Pretends to create the user, so the flow can be tested without Graph permissions.
///     A first name "Finnes" simulates a taken login name (a number is added), and "Feil" simulates an error.
/// </summary>
public class MockEntraUserProvisioner(IOptions<EntraProvisioningConfig> options) : IEntraUserProvisioner
{
    public async Task<EntraProvisioningResult> CreateUser(EntraUserRequest request,
        CancellationToken cancellationToken)
    {
        await Task.Delay(TimeSpan.FromSeconds(2), cancellationToken);

        if (request.DisplayName.StartsWith("Feil", StringComparison.OrdinalIgnoreCase))
            return EntraProvisioningResult.Failure("Entra ID svarte med feil (500)");

        // Only the plain name counts as taken, so the next candidate (with a number) is used
        var candidates = UserPrincipalNames.Candidates(request.DisplayName, options.Value.Domain).ToList();
        var isTaken = candidates.FirstOrDefault()?.StartsWith("finnes.", StringComparison.OrdinalIgnoreCase) == true;
        var userPrincipalName = candidates.Skip(isTaken ? 1 : 0).FirstOrDefault();

        return userPrincipalName is null
            ? EntraProvisioningResult.Failure("Fant ikke et ledig brukernavn")
            : EntraProvisioningResult.Success($"mock-{Guid.NewGuid()}", userPrincipalName);
    }
}

/// <summary>
///     Creates the user in Entra ID with Microsoft Graph: checks for an existing user and a free license,
///     creates the user, assigns the license and adds the user to the configured groups.
/// </summary>
public class GraphEntraUserProvisioner(
    GraphServiceClient graph,
    IOptions<EntraProvisioningConfig> options,
    ILogger<GraphEntraUserProvisioner> logger) : IEntraUserProvisioner
{
    public async Task<EntraProvisioningResult> CreateUser(EntraUserRequest request,
        CancellationToken cancellationToken)
    {
        var config = options.Value;
        if (!Guid.TryParse(config.LicenseSkuId, out var skuId))
            return EntraProvisioningResult.Failure("Lisens er ikke konfigurert");

        string? userId = null;
        try
        {
            var userPrincipalName = await FindFreeUserPrincipalName(request.DisplayName, config.Domain,
                cancellationToken);
            if (userPrincipalName is null)
                return EntraProvisioningResult.Failure("Fant ikke et ledig brukernavn");

            var skus = await graph.SubscribedSkus.GetAsync(cancellationToken: cancellationToken);
            var sku = skus?.Value?.FirstOrDefault(s => s.SkuId == skuId);
            if (sku is null) return EntraProvisioningResult.Failure("Fant ikke lisensen i tenanten");
            if ((sku.PrepaidUnits?.Enabled ?? 0) - (sku.ConsumedUnits ?? 0) <= 0)
                return EntraProvisioningResult.Failure("Ingen ledige lisenser");

            var names = request.DisplayName.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            var created = await graph.Users.PostAsync(new User
            {
                AccountEnabled = true,
                DisplayName = request.DisplayName,
                GivenName = names.FirstOrDefault(),
                Surname = names.Length > 1 ? names[^1] : null,
                UserPrincipalName = userPrincipalName,
                // The O365 address is the login name, never the candidate's private email
                Mail = userPrincipalName,
                MailNickname = userPrincipalName.Split('@')[0],
                UsageLocation = config.UsageLocation,
                Department = request.Department,
                EmployeeHireDate = request.HireDate?.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc),
                // Never stored or shown: first sign-in is meant to use a Temporary Access Pass
                PasswordProfile = new PasswordProfile
                    { Password = CreatePassword(), ForceChangePasswordNextSignIn = true }
            }, cancellationToken: cancellationToken);
            userId = created?.Id ?? throw new InvalidOperationException("Graph returned no user id");

            // A new user can take a few seconds to show up for the next calls
            await WithRetry(() => graph.Users[userId].AssignLicense.PostAsync(new AssignLicensePostRequestBody
            {
                AddLicenses = [new AssignedLicense { SkuId = skuId }],
                RemoveLicenses = []
            }, cancellationToken: cancellationToken), cancellationToken);

            foreach (var groupId in config.GroupIds)
                await WithRetry(() => graph.Groups[groupId].Members.Ref.PostAsync(new ReferenceCreate
                {
                    OdataId = $"https://graph.microsoft.com/v1.0/directoryObjects/{userId}"
                }, cancellationToken: cancellationToken), cancellationToken);

            return EntraProvisioningResult.Success(userId, userPrincipalName);
        }
        catch (ODataError error)
        {
            // Log only the status code: Graph error messages can contain the user's name or address
            logger.LogWarning("Graph returned {StatusCode} while creating an onboarding user", error.ResponseStatusCode);
            return EntraProvisioningResult.Failure(
                userId is null
                    ? $"Entra ID svarte med feil ({error.ResponseStatusCode})"
                    : $"Brukeren ble opprettet, men lisens eller grupper feilet ({error.ResponseStatusCode})",
                userId);
        }
    }

    /// <summary>The first login name from <see cref="UserPrincipalNames.Candidates" /> no user has as login or email</summary>
    private async Task<string?> FindFreeUserPrincipalName(string displayName, string domain,
        CancellationToken cancellationToken)
    {
        foreach (var candidate in UserPrincipalNames.Candidates(displayName, domain))
        {
            var escaped = candidate.Replace("'", "''");
            var existing = await graph.Users.GetAsync(r =>
            {
                r.QueryParameters.Filter = $"userPrincipalName eq '{escaped}' or mail eq '{escaped}'";
                r.QueryParameters.Select = ["id"];
            }, cancellationToken);
            if (existing?.Value is not { Count: > 0 }) return candidate;
        }

        return null;
    }

    private static async Task WithRetry(Func<Task> action, CancellationToken cancellationToken)
    {
        for (var attempt = 1;; attempt++)
            try
            {
                await action();
                return;
            }
            catch (ODataError error) when (error.ResponseStatusCode == 404 && attempt < 4)
            {
                await Task.Delay(TimeSpan.FromSeconds(2 * attempt), cancellationToken);
            }
    }

    public static string CreatePassword()
    {
        const string lower = "abcdefghijkmnopqrstuvwxyz";
        const string upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        const string digits = "23456789";
        const string symbols = "!@#$%&*-_+=?";
        const string all = lower + upper + digits + symbols;

        var chars = new[]
            {
                lower[RandomNumberGenerator.GetInt32(lower.Length)],
                upper[RandomNumberGenerator.GetInt32(upper.Length)],
                digits[RandomNumberGenerator.GetInt32(digits.Length)],
                symbols[RandomNumberGenerator.GetInt32(symbols.Length)]
            }
            .Concat(Enumerable.Range(0, 20).Select(_ => all[RandomNumberGenerator.GetInt32(all.Length)]))
            .ToArray();
        RandomNumberGenerator.Shuffle(chars.AsSpan());
        return new string(chars);
    }
}

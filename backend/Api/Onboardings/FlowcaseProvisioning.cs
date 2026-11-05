using System.Net;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;

namespace Api.Onboardings;

/// <summary>
///     Settings for creating CV profiles in Flowcase during onboarding (section "Flowcase").
///     Off unless Enabled is true.
/// </summary>
public class FlowcaseConfig
{
    public bool Enabled { get; set; }

    /// <summary>Use a fake provisioner that never calls Flowcase. Only allowed in Local and Development.</summary>
    public bool Mock { get; set; }

    /// <summary>e.g. https://subdomain.flowcase.com</summary>
    public string? BaseUrl { get; set; }

    /// <summary>
    ///     Needs the access level "Country manager" or "Administrator". Set as the environment variable
    ///     Flowcase__ApiKey, never in appsettings files.
    /// </summary>
    public string? ApiKey { get; set; }

    /// <summary>Base role of the new user in Flowcase</summary>
    public string Role { get; set; } = "consultant";

    /// <summary>Whether Flowcase sends its own welcome email to the new address</summary>
    public bool SendEmail { get; set; }

    public int PollIntervalSeconds { get; set; } = 10;
}

/// <param name="Email">The @variant.no address from the Entra step</param>
/// <param name="Office">Department name in Vibes; must match an office (department) name in Flowcase</param>
public record FlowcaseUserRequest(string Name, string Email, string Office);

/// <param name="Message">Shown on the status page to users with the onboarding role. Never logged.</param>
public record FlowcaseProvisioningResult(bool Succeeded, string? Message)
{
    public static FlowcaseProvisioningResult Success(string message)
    {
        return new FlowcaseProvisioningResult(true, message);
    }

    public static FlowcaseProvisioningResult Failure(string message)
    {
        return new FlowcaseProvisioningResult(false, message);
    }
}

public interface IFlowcaseUserProvisioner
{
    Task<FlowcaseProvisioningResult> CreateUser(FlowcaseUserRequest request, CancellationToken cancellationToken);
}

/// <summary>
///     Pretends to create the CV profile, so the flow can be tested without a Flowcase API key.
///     A first name "Flowcase" simulates an office that does not exist in Flowcase.
/// </summary>
public class MockFlowcaseUserProvisioner : IFlowcaseUserProvisioner
{
    public async Task<FlowcaseProvisioningResult> CreateUser(FlowcaseUserRequest request,
        CancellationToken cancellationToken)
    {
        await Task.Delay(TimeSpan.FromSeconds(2), cancellationToken);

        return request.Name.StartsWith("Flowcase", StringComparison.OrdinalIgnoreCase)
            ? FlowcaseProvisioningResult.Failure($"Fant ikke kontoret «{request.Office}» i Flowcase")
            : FlowcaseProvisioningResult.Success($"Opprettet CV-profil for {request.Email}");
    }
}

/// <summary>
///     Creates the user in Flowcase with its REST API (https://docs.flowcase.com/users).
///     An existing user with the same email is reused, so running the step again is safe.
/// </summary>
public class FlowcaseUserProvisioner(
    HttpClient http,
    IOptions<FlowcaseConfig> options,
    ILogger<FlowcaseUserProvisioner> logger) : IFlowcaseUserProvisioner
{
    public async Task<FlowcaseProvisioningResult> CreateUser(FlowcaseUserRequest request,
        CancellationToken cancellationToken)
    {
        using var existing = await http.GetAsync(
            $"api/v1/users/find?email={Uri.EscapeDataString(request.Email)}", cancellationToken);
        if (existing.IsSuccessStatusCode)
            return FlowcaseProvisioningResult.Success($"Fant eksisterende CV-profil for {request.Email}");
        if (existing.StatusCode != HttpStatusCode.NotFound) return Failure(existing, "api/v1/users/find");

        using var countriesResponse = await http.GetAsync("api/v1/countries?use_legacy_codes=false",
            cancellationToken);
        if (!countriesResponse.IsSuccessStatusCode) return Failure(countriesResponse, "api/v1/countries");
        var countries = await countriesResponse.Content.ReadFromJsonAsync<List<FlowcaseCountry>>(
            cancellationToken: cancellationToken) ?? [];

        var office = countries
            .SelectMany(country => country.Offices)
            .FirstOrDefault(o => string.Equals(o.Name.Trim(), request.Office.Trim(),
                StringComparison.OrdinalIgnoreCase));
        if (office is null)
            return FlowcaseProvisioningResult.Failure($"Fant ikke kontoret «{request.Office}» i Flowcase");

        var config = options.Value;
        using var created = await http.PostAsJsonAsync("api/v1/users", new
        {
            user = new
            {
                email = request.Email,
                upn = request.Email,
                name = request.Name,
                country_id = office.CountryId,
                office_id = office.Id,
                role = config.Role,
                send_email = config.SendEmail
            }
        }, cancellationToken);
        if (!created.IsSuccessStatusCode) return Failure(created, "api/v1/users");

        return FlowcaseProvisioningResult.Success($"Opprettet CV-profil for {request.Email}");
    }

    private FlowcaseProvisioningResult Failure(HttpResponseMessage response, string path)
    {
        // Log only status code and path: the body and query can contain the user's name or email
        var statusCode = (int)response.StatusCode;
        logger.LogWarning("Flowcase returned {StatusCode} for {Path}", statusCode, path);
        return FlowcaseProvisioningResult.Failure(statusCode switch
        {
            401 or 403 => $"Flowcase avviste API-nøkkelen ({statusCode})",
            422 => "Flowcase avviste brukeren, for eksempel fordi e-posten allerede er i bruk (422)",
            _ => $"Flowcase svarte med feil ({statusCode})"
        });
    }

    private record FlowcaseCountry(
        [property: JsonPropertyName("_id")] string Id,
        [property: JsonPropertyName("offices")]
        List<FlowcaseOffice> Offices);

    private record FlowcaseOffice(
        [property: JsonPropertyName("_id")] string Id,
        [property: JsonPropertyName("name")] string Name,
        [property: JsonPropertyName("country_id")]
        string CountryId);
}

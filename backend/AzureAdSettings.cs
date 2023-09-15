namespace backend;

public class AzureAdSettings
{
    public Uri Instance { get; set; } = null!;
    public bool DisableAuthAd { get; set; } = false;
    public string ClientId { get; set; } = null!;
    public string TenantId { get; set; } = null!;
    public string ApiScope { get; set; } = null!;

    public Uri AuthorizationUrl()
    {
        return new Uri(Instance + TenantId + "/oauth2/v2.0/authorize");
    }

    public Uri TokenUrl()
    {
        return new Uri(Instance + TenantId + "/oauth2/v2.0/token");
    }
}
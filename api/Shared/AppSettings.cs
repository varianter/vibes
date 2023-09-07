namespace Shared;

public record AppSettings
{
    public Uri AzureAppConfigUri { get; set; } = null!;
    public bool UseAzureAppConfig { get; set; }
    
    public string TenantId { get; set; }
}
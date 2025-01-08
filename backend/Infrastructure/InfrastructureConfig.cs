using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Infrastructure;

public sealed record InfrastructureConfig
{
    public required string ConnectionString { get; set; }
    public required bool EnableSensitiveDataLogging { get; set; }
}

internal static class ConfigExtensions
{
    internal static IHostApplicationBuilder AddConfig<T>(this IHostApplicationBuilder builder, out T currentConfig)
        where T : class
    {
        var name = typeof(T);
        var configSection = builder.Configuration.GetSection(typeof(T).Name);
        builder.Services.Configure<T>(configSection);
        currentConfig = configSection.Get<T>()!;
        return builder;
    }
}
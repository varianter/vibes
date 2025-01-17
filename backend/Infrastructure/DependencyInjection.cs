using Infrastructure.DatabaseContext;
using Infrastructure.TestContainers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IHostApplicationBuilder AddInfrastructure(this IHostApplicationBuilder builder)
    {
        builder
            .AddConfig<InfrastructureConfig>(out _)
            .AddConfig<TestContainersConfig>(out var currentTestContainersConfig);

        if (currentTestContainersConfig.Enabled)
            builder.AddTestContainers();

        builder.Services.AddDbContext<ApplicationContext>();

        return builder;
    }
}
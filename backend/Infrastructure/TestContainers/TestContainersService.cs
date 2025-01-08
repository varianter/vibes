using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.TestContainers;

public class TestContainersService(IServiceProvider serviceProvider) : IHostedService
{
    private TestContainersFactory? _testContainersFactory;

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = serviceProvider.CreateScope();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<TestContainersService>>();

        try
        {
            logger.LogInformation("Running TestContainersService");

            var config = scope.ServiceProvider.GetRequiredService<IOptions<TestContainersConfig>>().Value;
            if (config.Enabled)
            {
                var testContainersLogger = scope.ServiceProvider.GetRequiredService<ILogger<TestContainersFactory>>();
                _testContainersFactory = new TestContainersFactory(config, testContainersLogger);

                await _testContainersFactory.Start(cancellationToken);
            }
        }
        catch (Exception e)
        {
            logger.LogError(e, "Failed to start test containers service");
            throw;
        }

        logger.LogInformation("Finished running TestContainersService");
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return _testContainersFactory?.Stop(cancellationToken) ?? Task.CompletedTask;
    }
}
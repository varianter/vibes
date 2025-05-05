using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.TestContainers;

public class TestContainersFactory(TestContainersConfig config, ILogger<TestContainersFactory> logger)
{
    private const string DbContainerName = "testcontainers-api-db";
    private const string DbPassword = "test123!";
    private const int DbHostPort = 14333;
    private const int DbContainerPort = 1433;
    private const string SqlServerImage = "mcr.microsoft.com/azure-sql-edge:latest";

    public static readonly string DefaultConnectionString =
        $"Server=127.0.0.1,{DbHostPort};Database=master;User Id=sa;Password={DbPassword};TrustServerCertificate=True";

    private string? _currentConnectionString;
    private IContainer? _dbContainer;

    public string? CurrentConnectionString => _currentConnectionString;

    public async Task Start(CancellationToken cancellationToken = default, Overrides? overrides = null)
    {
        try
        {
            if (!config.Enabled) return;

            var dbHostPort = overrides?.DbHostPortOverride ?? DbHostPort;
            var dbContainerName = overrides?.DbContainerNameOverride ?? DbContainerName;

            logger.LogInformation("Starting TestContainers using generic container");

            var containerBuilder = new ContainerBuilder()
                .WithImage(SqlServerImage)
                .WithName(dbContainerName)
                .WithReuse(true)
                .WithEnvironment("ACCEPT_EULA", "Y")
                .WithEnvironment("SA_PASSWORD", DbPassword)
                .WithPortBinding(dbHostPort, DbContainerPort)
                .WithCreateParameterModifier(p => { p.Platform = "linux/amd64"; })
                .WithWaitStrategy(Wait.ForUnixContainer().UntilPortIsAvailable(DbContainerPort)
                );

            _dbContainer = containerBuilder.Build();

            await _dbContainer.StartAsync(cancellationToken);

            var mappedHostPort = _dbContainer.GetMappedPublicPort(DbContainerPort);
            _currentConnectionString =
                $"Server=127.0.0.1,{mappedHostPort};Database=master;User Id=sa;Password={DbPassword};TrustServerCertificate=True";

            logger.LogInformation("Test container started. Actual Connection String: {ConnectionString}",
                _currentConnectionString);


            var options = Options.Create(new InfrastructureConfig
            {
                ConnectionString = _currentConnectionString,
                EnableSensitiveDataLogging = true
            });

            await using var context = new ApplicationContext(options);

            if (config.RunMigrations)
                await MigrateDatabase(context, cancellationToken);

            if (config.SeedDatabase) logger.LogInformation("Seeding database with test data");
            // TODO: DataBuilder
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error while starting TestContainers");
            if (_dbContainer != null)
            {
                try
                {
                    await _dbContainer.StopAsync(CancellationToken.None);
                    await _dbContainer.DisposeAsync();
                }
                catch (Exception cleanupEx)
                {
                    logger.LogError(cleanupEx, "Error during container cleanup after failed start.");
                }

                _dbContainer = null;
            }

            _currentConnectionString = null;
            throw;
        }
    }

    public Task Stop(CancellationToken cancellationToken = default)
    {
        var stopTask = _dbContainer?.StopAsync(cancellationToken) ?? Task.CompletedTask;
        return stopTask;
    }

    public record Overrides(string? DbContainerNameOverride, int? DbHostPortOverride);

    private async Task MigrateDatabase(DbContext context, CancellationToken cancellationToken)
    {
        var retries = 0;
        while (!await context.Database.CanConnectAsync(cancellationToken) && retries < 10)
        {
            retries++;
            logger.LogInformation("Attempt #{AttemptNumber} to connect to DB failed, retrying in 1 second.", retries);
            await Task.Delay(1000, cancellationToken);
        }

        logger.LogInformation("Running database migrations");
        await context.Database.MigrateAsync(cancellationToken);
        logger.LogInformation("Database migrations completed.");
    }
}
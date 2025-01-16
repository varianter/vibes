using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Testcontainers.SqlEdge;

namespace Infrastructure.TestContainers;

public class TestContainersFactory(TestContainersConfig config, ILogger<TestContainersFactory> logger)
{
    private const string DbContainerName = "testcontainers-api-db";
    private const string DbPassword = "test123!";
    private const int DbHostPort = 14333;

    public static readonly string DefaultConnectionString =
        $"Server=127.0.0.1,{DbHostPort};Database=master;User Id=sa;Password={DbPassword};TrustServerCertificate=True";

    private SqlEdgeContainer? _sqlEdgeContainer;

    public string? CurrentConnectionString => _sqlEdgeContainer?.GetConnectionString();

    public async Task Start(CancellationToken cancellationToken = default, Overrides? overrides = null)
    {
        try
        {
            if (!config.Enabled) return;

            var dbHostPort = overrides?.DbHostPortOverride ?? DbHostPort;
            var dbContainerName = overrides?.DbContainerNameOverride ?? DbContainerName;

            logger.LogInformation("Starting TestContainers");

            _sqlEdgeContainer = new SqlEdgeBuilder()
                .WithName(dbContainerName)
                .WithReuse(true)
                .WithPassword(DbPassword)
                .WithPortBinding(dbHostPort, 1433)
                .Build();

            await _sqlEdgeContainer.StartAsync(cancellationToken);

            var options = Options.Create(new InfrastructureConfig
            {
                ConnectionString = _sqlEdgeContainer.GetConnectionString(),
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
        }
    }

    public Task Stop(CancellationToken cancellationToken = default)
    {
        var stopTask = _sqlEdgeContainer?.StopAsync(cancellationToken) ?? Task.CompletedTask;
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
    }
}
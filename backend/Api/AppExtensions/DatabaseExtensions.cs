using Infrastructure.DatabaseContext;
using Infrastructure.TestContainers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Api.AppExtensions;

public static class DatabaseExtensions
{
    /// <summary>
    ///     Applies Migrations to the configured database, will not migrate TestContainers as that happens in
    ///     <see cref="TestContainersFactory" />
    /// </summary>
    public static async Task<WebApplication> ApplyMigrations(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var testContainerOptions = scope.ServiceProvider.GetRequiredService<IOptions<TestContainersConfig>>();
        if (testContainerOptions.Value.Enabled) return app;

        var context = scope.ServiceProvider.GetRequiredService<ApplicationContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApplicationContext>>();

        var retries = 0;
        while (!await context.Database.CanConnectAsync() && retries < 10)
        {
            retries++;
            logger.LogInformation("Attempt #{AttemptNumber} to connect to DB failed, retrying in 1 second.", retries);
            await Task.Delay(1000);
        }

        logger.LogInformation("Running database migrations");
        await context.Database.MigrateAsync();

        return app;
    }
}

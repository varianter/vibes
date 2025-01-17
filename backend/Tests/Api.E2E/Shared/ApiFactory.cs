using System.Data.Common;
using System.Diagnostics;
using Api;
using Infrastructure;
using Infrastructure.DatabaseContext;
using Infrastructure.TestContainers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Respawn;
using Respawn.Graph;

namespace Tests.Api.E2E.Shared;

public class ApiFactory : WebApplicationFactory<Program>, IAsyncLifetime, ICollectionFixture<ApiFactory>
{
    public TestContainersFactory TestContainersFactory { get; private set; } = default!;
    public ApplicationContext DbContext { get; private set; } = default!;
    public HttpClient HttpClient { get; private set; } = default!;
    private DbConnection _dbConnection = default!;
    private Respawner _respawner = default!;

    private const string DbContainerName = "testcontainers-api-e2e-db";
    private const int DbHostPort = 14433;

    public async Task InitializeAsync()
    {
        var testContainersConfig = new TestContainersConfig
        {
            Enabled = true,
            RunMigrations = true,
            SeedDatabase = false
        };
        TestContainersFactory =
            new TestContainersFactory(testContainersConfig, NullLogger<TestContainersFactory>.Instance);

        await TestContainersFactory.Start(overrides: new TestContainersFactory.Overrides(DbContainerName, DbHostPort));

        DbContext = new ApplicationContext(Options.Create(new InfrastructureConfig
        {
            ConnectionString = TestContainersFactory.CurrentConnectionString ?? throw new UnreachableException(),
            EnableSensitiveDataLogging = true
        }));

        HttpClient = CreateClient();

        _dbConnection = new SqlConnection(TestContainersFactory.CurrentConnectionString);
        await _dbConnection.OpenAsync();

        _respawner = await Respawner.CreateAsync(_dbConnection, new RespawnerOptions
        {
            DbAdapter = DbAdapter.SqlServer,
            SchemasToInclude = ["dbo"],
            TablesToIgnore = [new Table("dbo", "__EFMigrationsHistory")]
        });

    }

    public new Task DisposeAsync()
    {
        HttpClient.Dispose();
        return TestContainersFactory.Stop();
    }

    protected override IHost CreateHost(IHostBuilder builder)
    {
        builder.ConfigureHostConfiguration(config => config.AddJsonFile("appsettings.Test.json", optional: true));
        return base.CreateHost(builder);
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll(typeof(TestContainersService));
            services.Configure<InfrastructureConfig>(opts =>
            {
                opts.ConnectionString =
                    TestContainersFactory.CurrentConnectionString ?? throw new UnreachableException();
            });
        });
    }

    public async Task ResetDatabaseAsync()
    {
        await _respawner.ResetAsync(_dbConnection);
    }
}
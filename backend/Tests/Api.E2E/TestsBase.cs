using Infrastructure.DatabaseContext;
using Tests.Api.E2E.Shared;

namespace Tests.Api.E2E;

[Collection(ApiTestCollection.CollectionName)]
public class TestsBase : IAsyncLifetime
{
    private readonly Func<Task> _resetDatabase;

    protected readonly HttpClient Client;
    protected readonly ApplicationContext DatabaseContext;

    protected TestsBase(ApiFactory apiFactory)
    {
        Client = apiFactory.HttpClient;
        _resetDatabase = apiFactory.ResetDatabaseAsync;
        DatabaseContext = apiFactory.DbContext;
    }
    
    public Task InitializeAsync()
    {
        return Task.CompletedTask;
    }

    public Task DisposeAsync()
    {
        DatabaseContext.ChangeTracker.Clear();
        return _resetDatabase();
    }
}
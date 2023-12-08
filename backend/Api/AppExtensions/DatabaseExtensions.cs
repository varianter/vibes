using Database.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace Api.AppExtensions;

public static class DatabaseExtensions
{
    public static WebApplication ApplyMigrations(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationContext>();
        db.Database.Migrate();
        return app;
    }
}
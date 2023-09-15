using backend.BuildHelpers;
using backend.Database.Contexts;
using backend.DomainModels;
using backend.Options;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
var connection = builder.Configuration.GetConnectionString("VibesDb");

if (string.IsNullOrEmpty(connection))
{
    ErrorHandler.ThrowRequirementsException("Could not find database connection string");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration);

builder.Services.AddAuthorization();
builder.Services.AddDbContext<ApplicationContext>(options => options.UseSqlServer(connection));


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var azureSettingsSection = builder.Configuration.GetSection("AzureAd");
var azureSettings = azureSettingsSection.Get<AzureAdOptions>();

if (azureSettings == null) // TODO: Better checking of params
{
    ErrorHandler.ThrowRequirementsException("Unable to load 'AzureAd' from settings");
}

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Vibes API", Version = "v1" });

    var disableSwaggerAuth = azureSettings != null && !builder.Environment.IsProduction() && azureSettings.DisableAuthAd;
    if (disableSwaggerAuth) return;

    SwaggerBuild.AddSwaggerOAuthSetupAction(azureSettings, c);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsProduction())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("v1/swagger.json", "Vibes Backend API");
        c.OAuthClientId($"{azureSettings?.ClientId}");
        c.OAuthUsePkce();
        c.OAuthScopeSeparator(" ");
    });
}

// Only use redirection in production
if (app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}


app.UseAuthorization();
app.MapControllers();

// Temporary test-endpoints
app.MapGet("/variant", (ApplicationContext dbContext) => dbContext.Consultant.ToList())
    .WithName("Varianter")
    .WithOpenApi()
    .RequireAuthorization();

app.MapGet("/variant/{id}", async (ApplicationContext db, string id) => await db.Consultant.FindAsync(id))
    .RequireAuthorization();

app.MapPost("/variant", async (ApplicationContext db, Consultant variant) =>
{
    await db.Consultant.AddAsync(variant);
    await db.SaveChangesAsync();
    return Results.Created($"/variant/{variant.Id}", variant);
}).RequireAuthorization();


app.Run();
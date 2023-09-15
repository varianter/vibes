using backend;
using backend.Database.Contexts;
using backend.DomainModels;
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
    .AddMicrosoftIdentityWebApi(builder.Configuration, "AzureAd");

builder.Services.AddAuthorization();
builder.Services.AddDbContext<ApplicationContext>(options => options.UseSqlServer(connection));


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var azureSettingsSection = builder.Configuration.GetSection("AzureAd");
var azureSettings = azureSettingsSection.Get<AzureAdSettings>();

if (azureSettings == null)
{
    ErrorHandler.ThrowRequirementsException("Unable to load 'AzureAd' from appsettings.*.json.");
}

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Vibes API", Version = "v1" });

    // To disable Auth to AD for pure db REST API testing.
    if (!builder.Environment.IsProduction() && azureSettings.DisableAuthAd) return;

    var scopes = new Dictionary<string, string>
    {
        { $"{azureSettings.ApiScope}", "Access API backend on user behalf" }
    };

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "oauth2" }
            },
            new[] { azureSettings.ApiScope }
        }
    });

    c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.OAuth2,
            Flows = new OpenApiOAuthFlows
            {
                Implicit = new OpenApiOAuthFlow()
                {
                    AuthorizationUrl = azureSettings.AuthorizationUrl(),
                    TokenUrl = azureSettings.TokenUrl(),
                    Scopes = scopes
                }
            }
        }
    );
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
        c.OAuthClientId($"{azureSettings.ClientId}");
        c.OAuthUsePkce();
        c.OAuthScopeSeparator(" ");
    });
}

if (app.Environment.IsProduction())
    // Only use redirection in production
    app.UseHttpsRedirection();


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
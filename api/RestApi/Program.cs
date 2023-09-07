using Azure.Identity;
using Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Shared;
using Shared.AzureIdentity;
using Swashbuckle.AspNetCore.Filters;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
    c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Vibes", Version = "v1" });
        c.OperationFilter<AddResponseHeadersFilter>(); // [SwaggerResponseHeader]

        c.OperationFilter<AppendAuthorizeToSummaryOperationFilter>(); // Adds "(Auth)" to the summary so that you can see which endpoints have Authorization
        c.OperationFilter<SecurityRequirementsOperationFilter>();
        c.AddSecurityDefinition("oauth2",
            new OpenApiSecurityScheme
            {
                Description = "Standard Authorization header using the Bearer scheme. Example: \"bearer {token}\"",
                In = ParameterLocation.Header,
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey
            });
    });

builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    // appsettings.Local.json is in the .gitignore. Using a local config instead of userSecrets to avoid references in the .csproj:
    .AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();


// Bind configuration "TestApp:Settings" section to the Settings object
var appSettingsSection = builder.Configuration
    .GetSection("AppSettings");

var initialAppSettings = appSettingsSection.Get<AppSettings>();

if (initialAppSettings == null) throw new Exception("Unable to load app settings");

if (initialAppSettings.UseAzureAppConfig)
{
    builder.Services.AddAzureAppConfiguration();

    // Load configuration from Azure App Configuration
    builder.Configuration.AddAzureAppConfiguration(options => options
        .Connect(initialAppSettings.AzureAppConfigUri, new DefaultAzureCredential()).ConfigureKeyVault(
            vaultOptions => { vaultOptions.SetCredential(new DefaultAzureCredential()); }));
}

builder.Services.Configure<AppSettings>(appSettingsSection);

builder.Services.AddDbContextPool<PostgresToAzureSqlContext>(options =>
{
    // Get connection string from configuration
    options.UseSqlServer(builder.Configuration.GetConnectionString("VibesDb"));

    // https://devblos.microsoft.com/azure-sdk/azure-identity-with-sql-graph-ef/
    options.AddInterceptors(new AzureAdAuthenticationDbConnectionInterceptor());
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        const string variantTenantId = ""; // Use .env for some kind of application.settings.json etc.
        options.Authority = $"https://login.microsoftonline.com/{variantTenantId}/v2.0/";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ClockSkew = TimeSpan.FromMinutes(5),
            RequireSignedTokens = true,
            ValidateIssuerSigningKey = true,
            ValidateIssuer = true,
            ValidIssuers = new[]
            {
                $"https://login.microsoftonline.com/{variantTenantId}/v2.0",
                $"https://sts.windows.net/{variantTenantId}/"
            },
            ValidateAudience = false,
            ValidateLifetime = true
        };
    });
builder.Services.AddAuthorization();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapGet("/", () => "So long, and thanks for all the fish.");
app.MapControllers();

app.Run();
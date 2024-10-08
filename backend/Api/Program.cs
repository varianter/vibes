using System.Text.Json.Serialization;
using Api.AppExtensions;
using Api.Options;
using Infrastructure.DatabaseContext;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
var connection = builder.Configuration.GetConnectionString("VibesDb");

if (string.IsNullOrEmpty(connection))
    throw new InvalidOperationException("No connection string found");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration);
builder.Services.AddAuthorization(opt => { opt.FallbackPolicy = opt.DefaultPolicy; });

builder.Services.AddDbContext<ApplicationContext>(options => options.UseSqlServer(connection));
builder.Services.AddMemoryCache();
builder.AddRepositories();

builder.Services.AddControllers()
    .AddJsonOptions(options => { options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()); });
builder.Services.AddEndpointsApiExplorer();


var adOptions = builder.Configuration.GetSection("AzureAd").Get<AzureAdOptions>();
if (adOptions == null) throw new InvalidOperationException("Required AzureAd options are missing");

builder.Services.AddSwaggerGen(genOptions =>
{
    genOptions.SwaggerDoc("v0", new OpenApiInfo { Title = "Vibes API", Version = "v0" });
    genOptions.ConfigureSwaggerAuthentication(adOptions);
    genOptions.SupportNonNullableReferenceTypes();
    genOptions.CustomSchemaIds(type => type.FullName);
});

var app = builder.Build();

app.ApplyMigrations();

app.UsePathBase("/v0");
app.MapControllers();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("v0/swagger.json", "Vibes Backend API");
    c.OAuthClientId(adOptions.ClientId);
    c.OAuthUsePkce();
    c.OAuthScopeSeparator(" ");
});

if (!app.Environment.IsProduction()) app.UseDeveloperExceptionPage();

// Only use redirection in production
if (app.Environment.IsProduction()) app.UseHttpsRedirection();

app.UseAuthorization();

app.Run();
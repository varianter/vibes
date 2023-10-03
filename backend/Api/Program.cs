using Api.BuildHelpers;
using Api.Options;
using Api.Routes;
using Database.DatabaseContext;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
var connection = builder.Configuration.GetConnectionString("VibesDb");

if (string.IsNullOrEmpty(connection))
    throw new Exception("No connection string found");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration);
builder.Services.AddAuthorization(opt => opt.FallbackPolicy = opt.DefaultPolicy);

builder.Services.AddDbContext<ApplicationContext>(options => options.UseSqlServer(connection));

builder.Services.AddMemoryCache();

builder.Services.AddEndpointsApiExplorer();

var adOptions = builder.Configuration.GetSection("AzureAd").Get<AzureAdOptions>();
if (adOptions == null) throw new Exception("Required AzureAd options are missing");

builder.Services.AddSwaggerGen(genOptions =>
{
    genOptions.SwaggerDoc("v1", new OpenApiInfo { Title = "Vibes API", Version = "v1" });
    genOptions.ConfigureSwaggerAuthentication(adOptions);
});

var app = builder.Build();

app.MapGroup("/v1").ApiGroupVersionOne();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("v1/swagger.json", "Vibes Backend API");
    c.OAuthClientId(adOptions.ClientId);
    c.OAuthUsePkce();
    c.OAuthScopeSeparator(" ");
});

if (!app.Environment.IsProduction()) app.UseDeveloperExceptionPage();

// Only use redirection in production
if (app.Environment.IsProduction()) app.UseHttpsRedirection();

app.UseAuthorization();

app.Run();
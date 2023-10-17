using Api.Authorization;
using Api.BuildHelpers;
using Api.Consultants;
using Api.Options;
using Database.DatabaseContext;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
var connection = builder.Configuration.GetConnectionString("VibesDb");

if (string.IsNullOrEmpty(connection))
    throw new Exception("No connection string found");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration);
builder.Services.AddAuthorization(opt => {
    opt.FallbackPolicy = opt.DefaultPolicy; 
    opt.AddPolicy("Organisation", policy=>policy.Requirements.Add(new OrganisationRequirement()));
    });

builder.Services.AddDbContext<ApplicationContext>(options => options.UseSqlServer(connection));

builder.Services.AddMemoryCache();


builder.Services.Configure<OrganizationOptions>(builder.Configuration.GetSection("OrganizationSettings"));
builder.Services.AddSingleton<HolidayService>();
builder.Services.AddSingleton<ConsultantService>();
builder.Services.AddSingleton<IAuthorizationHandler, OrganisationPolicyHandler>();
builder.Services.AddTransient<AuthorizationService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();


var adOptions = builder.Configuration.GetSection("AzureAd").Get<AzureAdOptions>();
if (adOptions == null) throw new Exception("Required AzureAd options are missing");

builder.Services.AddSwaggerGen(genOptions =>
{
    genOptions.SwaggerDoc("v0", new OpenApiInfo { Title = "Vibes API", Version = "v0" });
    genOptions.ConfigureSwaggerAuthentication(adOptions);
});

var app = builder.Build();

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
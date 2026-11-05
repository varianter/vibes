using System.Text.Json.Serialization;
using Anthropic;
using Api.AppExtensions;
using Api.Common;
using Api.Consultants;
using Api.Onboardings;
using Api.Options;
using Azure.Identity;
using Infrastructure;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Graph;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
builder.AddInfrastructure();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration);
builder.Services.AddAuthorization(opt => { opt.FallbackPolicy = opt.DefaultPolicy; });

builder.Services.AddMemoryCache();
builder.AddRepositories();

builder.Services.AddScoped<IStorageService, StorageService>();

var isLocalOrDevelopment = builder.Environment.IsDevelopment() || builder.Environment.IsEnvironment("Local");

if (isLocalOrDevelopment && builder.Configuration.GetValue<bool>("MockDocumentExtraction"))
{
    builder.Services.AddScoped<IConsultantDocumentExtractor, MockConsultantDocumentExtractor>();
}
else
{
    // Reads ANTHROPIC_API_KEY from the environment
    builder.Services.AddSingleton<AnthropicClient>(_ => new AnthropicClient());
    builder.Services.AddScoped<IConsultantDocumentExtractor, ConsultantDocumentExtractor>();
}

// Creating users in Entra ID / O365 during onboarding. Off unless explicitly enabled.
var entraSection = builder.Configuration.GetSection("EntraProvisioning");
builder.Services.Configure<EntraProvisioningConfig>(entraSection);
var entraConfig = entraSection.Get<EntraProvisioningConfig>() ?? new EntraProvisioningConfig();
if (entraConfig.Enabled)
{
    if (entraConfig.Mock)
    {
        if (!isLocalOrDevelopment)
            throw new InvalidOperationException("EntraProvisioning:Mock is only allowed in Local and Development");
        builder.Services.AddScoped<IEntraUserProvisioner, MockEntraUserProvisioner>();
    }
    else
    {
        // A developer's own Azure login would otherwise create real users in the tenant
        if (isLocalOrDevelopment)
            throw new InvalidOperationException(
                "Real Entra provisioning is not allowed in Local and Development. Set EntraProvisioning:Mock to true.");

        // Uses the App Service's managed identity in Azure
        builder.Services.AddSingleton(_ =>
            new GraphServiceClient(new DefaultAzureCredential(), ["https://graph.microsoft.com/.default"]));
        builder.Services.AddScoped<IEntraUserProvisioner, GraphEntraUserProvisioner>();
    }

    builder.Services.AddOnboardingStepProcessor<EntraOnboardingStepProcessor>(entraConfig.PollIntervalSeconds);
}

// Creating CV profiles in Flowcase during onboarding. Off unless explicitly enabled.
var flowcaseSection = builder.Configuration.GetSection("Flowcase");
builder.Services.Configure<FlowcaseConfig>(flowcaseSection);
var flowcaseConfig = flowcaseSection.Get<FlowcaseConfig>() ?? new FlowcaseConfig();
if (flowcaseConfig.Enabled)
{
    if (flowcaseConfig.Mock)
    {
        if (!isLocalOrDevelopment)
            throw new InvalidOperationException("Flowcase:Mock is only allowed in Local and Development");
        builder.Services.AddScoped<IFlowcaseUserProvisioner, MockFlowcaseUserProvisioner>();
    }
    else
    {
        // Flowcase has no test account, so a local run would create real profiles
        if (isLocalOrDevelopment)
            throw new InvalidOperationException(
                "Real Flowcase provisioning is not allowed in Local and Development. Set Flowcase:Mock to true.");
        if (!Uri.TryCreate(flowcaseConfig.BaseUrl, UriKind.Absolute, out var flowcaseUrl) ||
            string.IsNullOrWhiteSpace(flowcaseConfig.ApiKey))
            throw new InvalidOperationException("Flowcase:BaseUrl and the Flowcase__ApiKey environment variable are required");

        builder.Services.AddHttpClient<IFlowcaseUserProvisioner, FlowcaseUserProvisioner>(client =>
            {
                client.BaseAddress = new Uri(flowcaseUrl, "/");
                client.DefaultRequestHeaders.Authorization = new("Bearer", flowcaseConfig.ApiKey);
            })
            // The default HTTP logging writes request URLs, which contain the user's email
            .RemoveAllLoggers();
    }

    builder.Services.AddOnboardingStepProcessor<FlowcaseOnboardingStepProcessor>(flowcaseConfig.PollIntervalSeconds);
}

var mockRoles = builder.Configuration["MockRoles"];
if (isLocalOrDevelopment && !string.IsNullOrWhiteSpace(mockRoles))
    builder.Services.AddTransient<IClaimsTransformation>(_ => new MockRolesClaimsTransformation(mockRoles));

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.NumberHandling = JsonNumberHandling.AllowReadingFromString |
                                                       JsonNumberHandling.AllowNamedFloatingPointLiterals;
    });
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

await app.ApplyMigrations();

app.UsePathBase("/v0");
app.MapControllers();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
  c.SwaggerEndpoint("v0/swagger.json", "Vibes Backend API");
  c.EnableTryItOutByDefault();
  c.OAuthClientId(adOptions.ClientId);
  c.OAuthUsePkce();
  c.OAuthScopeSeparator(" ");
});

if (!app.Environment.IsProduction()) app.UseDeveloperExceptionPage();

// Only use redirection in production
if (app.Environment.IsProduction()) app.UseHttpsRedirection();

app.UseAuthorization();

await app.RunAsync();

namespace Api
{
    // ReSharper disable once PartialTypeWithSinglePart
    // ReSharper disable once UnusedType.Global
    // ReSharper disable once ClassNeverInstantiated.Global
    public partial class Program;
}
using Core.Engagement;
using Core.Organization;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Api.AppExtensions;

public static class RepositoryExtensions
{
    public static void AddRepositories(this WebApplicationBuilder builder)
    {
        builder.Services.AddScoped<IOrganisationRepository, OrganisationDbRepository>();
        builder.Services.AddScoped<IEngagementRepository, EngagementDbRepository>();
    }
}
using Core.Engagements;
using Core.Organizations;
using Infrastructure.Repositories.Engagement;
using Infrastructure.Repositories.Organization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Repositories;

public static class RepositoryExtensions
{
    public static void AddRepositories(this WebApplicationBuilder builder)
    {
        builder.Services.AddScoped<IOrganisationRepository, OrganisationDbRepository>();
        builder.Services.Decorate<IOrganisationRepository, OrganizationCacheRepository>();

        builder.Services.AddScoped<IEngagementRepository, EngagementDbRepository>();
        builder.Services.AddScoped<IDepartmentRepository, DepartmentDbRepository>();
    }
}
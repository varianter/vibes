using Core.IRepositories;
using Infrastructure.Repositories;

namespace Api.AppExtensions;

public static class RepositoryExtensions
{
    public static void AddRepositories(this WebApplicationBuilder builder)
    {
        builder.Services.AddScoped<IOrganisationRepository, OrganisationDbRepository>();
        builder.Services.AddScoped<IEngagementRepository, EngagementDbRepository>();
    }
}
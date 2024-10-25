using Core.Consultants;
using Core.Engagements;
using Core.Organizations;
using Core.PlannedAbsences;
using Core.Staffings;
using Infrastructure.Repositories.Consultants;
using Infrastructure.Repositories.Engagement;
using Infrastructure.Repositories.Organization;
using Infrastructure.Repositories.PlannedAbsences;
using Infrastructure.Repositories.Staffings;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Repositories;

public static class RepositoryExtensions
{
    public static void AddRepositories(this WebApplicationBuilder builder)
    {
        builder.Services.AddScoped<IOrganisationRepository, OrganisationDbRepository>();

        builder.Services.AddScoped<IEngagementRepository, EngagementDbRepository>();
        builder.Services.AddScoped<IDepartmentRepository, DepartmentDbRepository>();

        builder.Services.AddScoped<IPlannedAbsenceRepository, PlannedAbsenceDbRepository>();
        builder.Services.Decorate<IPlannedAbsenceRepository, PlannedAbsenceCacheRepository>();

        builder.Services.AddScoped<IStaffingRepository, StaffingDbRepository>();
        builder.Services.Decorate<IStaffingRepository, StaffingCacheRepository>();

        builder.Services.AddScoped<IConsultantRepository, ConsultantDbRepository>();
    }
}
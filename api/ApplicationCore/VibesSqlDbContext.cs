using ApplicationCore.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore;

public class VibesSqlDbContext : DbContext
{

    public VibesSqlDbContext(DbContextOptions<VibesSqlDbContext> options)
        : base(options)
    {
    }

    public DbSet<AdditionalVacationDayEntity> AdditionalVacationDays { get; set; }

    public DbSet<AdministratorEntity> Administrators { get; set; }

    public DbSet<BudgetEntity> Budgets { get; set; }

    public DbSet<ConsultantEntity> Consultants { get; set; }

    public DbSet<CustomerEntity> Customers { get; set; }

    public DbSet<DepartmentEntity> Departments { get; set; }

    public DbSet<EngagementEntity> Engagements { get; set; }

    public DbSet<GroupEntity> Groups { get; set; }

    public DbSet<OrganizationEntity> Organizations { get; set; }

    public DbSet<StaffingEntity> Staffings { get; set; }

    public DbSet<VacationEntity> Vacations { get; set; }
}
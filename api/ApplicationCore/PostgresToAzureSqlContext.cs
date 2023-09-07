using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure;

public class PostgresToAzureSqlContext : DbContext
{
    public PostgresToAzureSqlContext()
    {
    }

    public PostgresToAzureSqlContext(DbContextOptions<PostgresToAzureSqlContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AdditionalVacationDayEntity> AdditionalVacationDays { get; set; }

    public virtual DbSet<AdministratorEntity> Administrators { get; set; }

    public virtual DbSet<BudgetEntity> Budgets { get; set; }

    public virtual DbSet<ConsultantEntity> Consultants { get; set; }

    public virtual DbSet<CustomerEntity> Customers { get; set; }

    public virtual DbSet<DepartmentEntity> Departments { get; set; }

    public virtual DbSet<EngagementEntity> Engagements { get; set; }

    public virtual DbSet<GroupEntity> Groups { get; set; }

    public virtual DbSet<OrganizationEntity> Organizations { get; set; }

    public virtual DbSet<StaffingEntity> Staffings { get; set; }

    public virtual DbSet<VacationEntity> Vacations { get; set; }
}
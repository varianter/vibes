using Core.DomainModels;
using Database.ValueConverters;
using Microsoft.EntityFrameworkCore;

namespace Database.DatabaseContext;

public class ApplicationContext : DbContext
{
    public ApplicationContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Consultant> Consultant { get; set; } = null!;
    public DbSet<Competence> Competence { get; set; } = null!;
    public DbSet<CompetenceConsultant> CompetenceConsultant { get; set; } = null!;
    public DbSet<Department> Department { get; set; } = null!;
    public DbSet<Organization> Organization { get; set; } = null!;
    public DbSet<Absence> Absence { get; set; } = null!;

    public DbSet<PlannedAbsence> PlannedAbsence { get; set; } = null!;
    public DbSet<Vacation> Vacation { get; set; } = null!;
    public DbSet<Customer> Customer { get; set; } = null!;
    public DbSet<Engagement> Project { get; set; } = null!;
    public DbSet<Staffing> Staffing { get; set; } = null!;
    public DbSet<Forecast> Forecast { get; set; } = null!;


    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder
            .Properties<DateOnly>()
            .HaveConversion<DateOnlyConverter>();

        configurationBuilder
            .Properties<Week>()
            .HaveConversion<WeekConverter>();

        configurationBuilder
            .Properties<Month>()
            .HaveConversion<MonthConverter>();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Organization>()
            .HasMany(org => org.Departments)
            .WithOne(dept => dept.Organization);

        modelBuilder.Entity<Organization>()
            .HasMany(organization => organization.AbsenceTypes)
            .WithOne(absence => absence.Organization);

        modelBuilder.Entity<Organization>()
            .HasMany(organization => organization.Customers)
            .WithOne(customer => customer.Organization)
            .HasForeignKey(customer => customer.OrganizationId);

        modelBuilder.Entity<Customer>()
            .HasIndex(customer => new { customer.OrganizationId, customer.Name })
            .IsUnique();

        modelBuilder.Entity<Customer>()
            .HasMany(customer => customer.Projects)
            .WithOne(project => project.Customer)
            .HasForeignKey(project => project.CustomerId);

        modelBuilder.Entity<Engagement>()
            .HasIndex(engagement => new { engagement.CustomerId, engagement.Name })
            .IsUnique();

        modelBuilder.Entity<Engagement>()
            .Property(project => project.State)
            .HasConversion<string>();

        modelBuilder.Entity<Staffing>()
            .HasKey(staffing => new StaffingKey(staffing.EngagementId, staffing.ConsultantId, staffing.Week));

        modelBuilder.Entity<PlannedAbsence>()
            .HasKey(plannedAbsence =>
                new PlannedAbsenceKey(plannedAbsence.AbsenceId, plannedAbsence.ConsultantId, plannedAbsence.Week));

        modelBuilder.Entity<Engagement>()
            .HasMany(p => p.Consultants)
            .WithMany(c => c.Projects)
            .UsingEntity<Staffing>(
                staffing => staffing.HasOne<Consultant>(s => s.Consultant)
                    .WithMany(c => c.Staffings)
                    .OnDelete(DeleteBehavior.ClientCascade),
                staffing => staffing
                    .HasOne<Engagement>(s => s.Engagement)
                    .WithMany(c => c.Staffings)
                    .OnDelete(DeleteBehavior.Cascade)
            );

        modelBuilder.Entity<Absence>()
            .HasMany<Consultant>()
            .WithMany()
            .UsingEntity<PlannedAbsence>(
                plannedAbsence => plannedAbsence
                    .HasOne<Consultant>(pa => pa.Consultant)
                    .WithMany(c => c.PlannedAbsences)
                    .OnDelete(DeleteBehavior.Cascade),
                plannedAbsence => plannedAbsence
                    .HasOne<Absence>(pa => pa.Absence)
                    .WithMany()
                    .OnDelete(DeleteBehavior.ClientCascade)
            );

        modelBuilder.Entity<Consultant>()
            .HasOne<Department>(consultant => consultant.Department)
            .WithMany(dept => dept.Consultants);

        modelBuilder.Entity<Consultant>()
            .HasMany(consultant => consultant.Vacations)
            .WithOne(vacation => vacation.Consultant);

        modelBuilder.Entity<Consultant>()
            .HasMany(consultant => consultant.PlannedAbsences)
            .WithOne(absence => absence.Consultant);

        modelBuilder.Entity<Consultant>()
            .Property(v => v.Degree)
            .HasConversion<string>();

        modelBuilder.Entity<Consultant>()
            .Property(v => v.StartDate)
            .HasConversion<DateOnlyConverter>();

        modelBuilder.Entity<Consultant>()
            .Property(v => v.EndDate)
            .HasConversion<DateOnlyConverter>();

        /*modelBuilder.Entity<Consultant>()
            .HasMany(v => v.CompetenceConsultant)
            .WithMany();*/

        modelBuilder.Entity<Consultant>()
            .Property(c => c.TransferredVacationDays)
            .HasDefaultValue(0);

        modelBuilder.Entity<CompetenceConsultant>()
            .HasKey(us => new { us.ConsultantId, us.CompetencesId });

        modelBuilder.Entity<CompetenceConsultant>()
            .HasOne(us => us.Consultant)
            .WithMany(u => u.CompetenceConsultant)
            .HasForeignKey(us => us.ConsultantId);

        modelBuilder.Entity<CompetenceConsultant>()
            .HasOne(us => us.Competence)
            .WithMany(s => s.CompetenceConsultant)
            .HasForeignKey(us => us.CompetencesId);

        modelBuilder.Entity<Forecast>()
        .HasOne(f => f.Consultant)
        .WithMany(c => c.Forecasts)
        .HasForeignKey(f => f.ConsultantId);

        modelBuilder.Entity<Forecast>()
        .Property(f => f.Month)
        .HasConversion<MonthConverter>();

        modelBuilder.Entity<Competence>().HasData(new List<Competence>
        {
            new() { Id = "frontend", Name = "Frontend" },
            new() { Id = "backend", Name = "Backend" },
            new() { Id = "design", Name = "Design" },
            new() { Id = "project-mgmt", Name = "Project Management" },
            new() { Id = "development", Name = "Utvikling" }
        });

        modelBuilder.Entity<Organization>()
            .HasData(new
            {
                Id = "variant-as",
                Name = "Variant AS",
                UrlKey = "variant-as",
                Country = "norway",
                HoursPerWorkday = 7.5,
                HasVacationInChristmas = true,
                NumberOfVacationDaysInYear = 25
            });

        modelBuilder.Entity<Department>()
            .HasData(new { Id = "trondheim", Name = "Trondheim", OrganizationId = "variant-as" });

        modelBuilder.Entity<Consultant>().HasData(new
        {
            Id = 1,
            Name = "Jonas",
            Email = "j@variant.no",
            StartDate = new DateOnly(2020, 1, 1),
            DepartmentId = "trondheim",
            Degree = Degree.Master,
            GraduationYear = 2019
        });

        base.OnModelCreating(modelBuilder);
    }
}

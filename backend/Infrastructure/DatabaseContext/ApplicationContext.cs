using Core.Absences;
using Core.Agreements;
using Core.Consultants;
using Core.Consultants.Competences;
using Core.Consultants.Disciplines;
using Core.Customers;
using Core.Engagements;
using Core.Forecasts;
using Core.Organizations;
using Core.PlannedAbsences;
using Core.Staffings;
using Core.Vacations;
using Core.Weeks;
using Infrastructure.ValueConverters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Infrastructure.DatabaseContext;

public class ApplicationContext(IOptions<InfrastructureConfig> config) : DbContext
{
    public DbSet<Discipline> Disciplines { get; init; } = null!;
    public DbSet<Consultant> Consultant { get; init; } = null!;
    public DbSet<Competence> Competence { get; init; } = null!;
    public DbSet<CompetenceConsultant> CompetenceConsultant { get; init; } = null!;
    public DbSet<Department> Department { get; init; } = null!;
    public DbSet<Organization> Organization { get; init; } = null!;
    public DbSet<Absence> Absence { get; init; } = null!;
    public DbSet<PlannedAbsence> PlannedAbsence { get; init; } = null!;
    public DbSet<Vacation> Vacation { get; init; } = null!;
    public DbSet<Customer> Customer { get; init; } = null!;
    public DbSet<Engagement> Project { get; init; } = null!;
    public DbSet<Staffing> Staffing { get; init; } = null!;
    public DbSet<Agreement> Agreements { get; init; } = null!;
    public DbSet<Forecast> Forecasts { get; init; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(config.Value.ConnectionString)
            .EnableSensitiveDataLogging(config.Value
                .EnableSensitiveDataLogging);
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder
            .Properties<DateOnly>()
            .HaveConversion<DateOnlyConverter>();

        configurationBuilder
            .Properties<Week>()
            .HaveConversion<WeekConverter>();
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
            .HasIndex(customer => new { customer.OrganizationId, customer.Name, customer.IsActive })
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
            .HasMany(c => c.Forecasts)
            .WithOne()
            .HasForeignKey(f => f.ConsultantId);

        modelBuilder.Entity<Consultant>()
            .Property(v => v.Degree)
            .HasConversion<string>();

        modelBuilder.Entity<Consultant>()
            .Property(v => v.StartDate)
            .HasConversion<DateOnlyConverter>();

        modelBuilder.Entity<Consultant>()
            .Property(v => v.EndDate)
            .HasConversion<DateOnlyConverter>();

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
            .HasKey(f => new { f.ConsultantId, f.Month });

        /*
        modelBuilder.Entity<Forecast>()
            .HasIndex(f => new { f.ConsultantId, f.Month })
            .IsUnique();
            */


        modelBuilder.Entity<Competence>().HasData(new List<Competence>
        {
            new() { Id = "frontend", Name = "Frontend" },
            new() { Id = "backend", Name = "Backend" },
            new() { Id = "design", Name = "Design" },
            new() { Id = "project-mgmt", Name = "Project Management" },
            new() { Id = "development", Name = "Utvikling" }
        });

        modelBuilder.Entity<Discipline>()
            .HasMany(d => d.Consultants)
            .WithOne(c => c.Discipline)
            .HasForeignKey(c => c.DisciplineId);

        modelBuilder.Entity<Discipline>().HasData(new List<Discipline>
        {
            new() { Id = "frontend", Name = "Frontend" },
            new() { Id = "dotnet", Name = ".NET" },
            new() { Id = "platform", Name = "Plattform" },
            new() { Id = "strategic-design", Name = "Strategisk design" },
            new() { Id = "ux-design", Name = "UX-design" },
            new() { Id = "service-design", Name = "Tjenestedesign" },
            new() { Id = "ppp", Name = "PPP-ledelse" },
            new() { Id = "jvm", Name = "JVM" },
            new() { Id = "sales", Name = "Salg" },
        });

        modelBuilder.Entity<Agreement>(entity =>
        {
            entity.HasOne(a => a.Customer)
                .WithMany(c => c.Agreements)
                .HasForeignKey(a => a.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Engagement)
                .WithMany(e => e.Agreements)
                .HasForeignKey(a => a.EngagementId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.OwnsMany(a => a.Files, fr =>
            {
                fr.WithOwner().HasForeignKey("AgreementId");
                fr.Property<int>("Id");
                fr.HasKey("Id");
            });
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

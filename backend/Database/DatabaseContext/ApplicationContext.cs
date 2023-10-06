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
    public DbSet<Department> Department { get; set; } = null!;
    public DbSet<PlannedAbsence> PlannedAbsence { get; set; } = null!;
    public DbSet<Vacation> Vacation { get; set; } = null!;
    public DbSet<Customer> Customer { get; set; } = null!;
    public DbSet<Project> Project { get; set; } = null!;
    public DbSet<Staffing> Staffing { get; set; } = null!;


    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder
            .Properties<DateOnly>()
            .HaveConversion<DateOnlyConverter>();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>()
            .HasMany(customer => customer.Projects)
            .WithOne(project => project.Customer);

        modelBuilder.Entity<Project>()
            .Property(project => project.State)
            .HasConversion<string>();

        modelBuilder.Entity<Project>()
            .HasMany(p => p.Consultants)
            .WithMany(c => c.Projects)
            .UsingEntity<Staffing>(
                r => r.HasOne<Consultant>(s => s.Consultant)
                    .WithMany(c => c.Staffings)
                    .OnDelete(DeleteBehavior.ClientCascade),
                l => l
                    .HasOne<Project>(s => s.Project)
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

        modelBuilder.Entity<Consultant>()
            .HasMany(v => v.Competences)
            .WithMany();

        modelBuilder.Entity<Competence>().HasData(new List<Competence>
        {
            new() { Id = "frontend", Name = "Frontend" },
            new() { Id = "backend", Name = "Backend" },
            new() { Id = "design", Name = "Design" },
            new() { Id = "project-mgmt", Name = "Project Management" }
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
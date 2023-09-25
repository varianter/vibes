using backend.Core.DomainModels;
using backend.Database.ValueConverters;
using Microsoft.EntityFrameworkCore;

namespace backend.Database.Contexts;

public class ApplicationContext : DbContext
{
    public ApplicationContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Consultant> Consultant { get; set; } = null!;
    public DbSet<Competence> Competence { get; set; } = null!;
    public DbSet<Department> Department { get; set; } = null!;
    public DbSet<Organization> Organization { get; set; } = null!;
    public DbSet<PlannedAbsence> PlannedAbsence { get; set; } = null!;
    public DbSet<Vacation> Vacation { get; set; } = null!;
    public DbSet<Client> Client { get; set; } = null!;
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
        modelBuilder.Entity<Organization>()
            .HasMany<Department>(org => org.Departments)
            .WithOne(dept => dept.Organization);

        modelBuilder.Entity<Organization>()
            .HasMany<Client>(organization => organization.Clients)
            .WithOne(client => client.Organization);

        modelBuilder.Entity<Client>()
            .HasMany<Project>(client => client.Projects)
            .WithOne(project => project.Client);

        modelBuilder.Entity<Project>()
            .HasMany<Staffing>(project => project.Staffings)
            .WithOne(staffing => staffing.Project).OnDelete(DeleteBehavior.NoAction);
        modelBuilder.Entity<Project>()
            .Property(project => project.State)
            .HasConversion<string>();

        modelBuilder.Entity<Consultant>()
            .HasMany<Staffing>(consultant => consultant.Staffings)
            .WithOne(staffing => staffing.Consultant);

        modelBuilder.Entity<Consultant>()
            .HasOne<Department>(consultant => consultant.Department)
            .WithMany(dept => dept.Consultants);

        modelBuilder.Entity<Consultant>()
            .HasMany<Vacation>(consultant => consultant.Vacations)
            .WithOne(vacation => vacation.Consultant);

        modelBuilder.Entity<Consultant>()
            .HasMany<PlannedAbsence>(consultant => consultant.PlannedAbsences)
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

        modelBuilder.Entity<Organization>()
            .HasData(new { Name = "Variant AS", HoursPerWorkday = (float)7.5, Id = "variant-as" });

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
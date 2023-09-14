using backend.Database.ValueConverters;
using backend.DomainModels;
using Microsoft.EntityFrameworkCore;

namespace backend.Database.Contexts;

public class ApplicationContext : DbContext
{
    public ApplicationContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Variant> Variant { get; set; } = null!;
    public DbSet<Competence> Competence { get; set; } = null!;
    public DbSet<Department> Department { get; set; } = null!;
    public DbSet<Organization> Organization { get; set; } = null!;


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

        modelBuilder.Entity<Variant>()
            .HasOne<Department>(v => v.Department)
            .WithMany(dept => dept.Variants);

        modelBuilder.Entity<Variant>()
            .Property(v => v.Degree)
            .HasConversion<string>();

        modelBuilder.Entity<Variant>()
            .Property(v => v.StartDate)
            .HasConversion<DateOnlyConverter>();

        modelBuilder.Entity<Variant>()
            .Property(v => v.EndDate)
            .HasConversion<DateOnlyConverter>();

        modelBuilder.Entity<Variant>()
            .HasMany(v => v.Competences)
            .WithMany();

        modelBuilder.Entity<Competence>().HasData(new List<Competence>
        {
            new() { Id = 1, Name = "Frontend" },
            new() { Id = 2, Name = "Backend" },
            new() { Id = 3, Name = "Design" },
            new() { Id = 4, Name = "Project Management" }
        });

        modelBuilder.Entity<Organization>()
            .HasData(new { Name = "Variant AS", HoursPerWorkday = (float)7.5, Id = 1 });

        modelBuilder.Entity<Department>()
            .HasData(new { Id = 1, Name = "Trondheim", OrganizationId = 1 });

        modelBuilder.Entity<Variant>().HasData(new
        {
            Id = 1,
            Name = "Jonas",
            Email = "j@variant.no",
            StartDate = new DateOnly(2020, 1, 1),
            DepartmentId = 1,
            Degree = Degree.Master,
            GraduationYear = 2019
        });

        base.OnModelCreating(modelBuilder);
    }
}
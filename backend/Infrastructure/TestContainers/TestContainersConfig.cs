namespace Infrastructure.TestContainers;

public record TestContainersConfig
{
    public required bool Enabled { get; set; }
    public required bool RunMigrations { get; set; }
    public required bool SeedDatabase { get; set; }
}
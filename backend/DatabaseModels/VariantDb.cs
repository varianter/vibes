using backend.DomainModels;
using Microsoft.EntityFrameworkCore;

namespace backend.DatabaseModels;

public class VariantDb : DbContext
{
    public VariantDb(DbContextOptions options) : base(options) { }
    public DbSet<Variant> Variants { get; set; } = null!;
}
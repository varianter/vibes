using backend.DatabaseModels;
using backend.DomainModels;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;

var builder = WebApplication.CreateBuilder(args);
var connection = builder.Configuration.GetConnectionString("LocalDb");


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddMicrosoftIdentityWebApi(builder.Configuration, "AzureAd");
builder.Services.AddAuthorization();
builder.Services.AddDbContext<VariantDb>(options => options.UseSqlServer(connection));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Local"))
{
    app.UseSwagger();
    app.UseSwaggerUI();

}

if (app.Environment.IsProduction())
{
    // Only use redirection in production
    app.UseHttpsRedirection();
}


app.UseAuthorization();

app.MapControllers();

app.MapGet("/variant", (VariantDb dbContext) => dbContext.Variants.ToList()).WithName("Varianter").WithOpenApi();
app.MapGet("/variant/{id}", async (VariantDb db, string id) => await db.Variants.FindAsync(id));
app.MapPost("/variant", async (VariantDb db, Variant variant) =>
{
    await db.Variants.AddAsync(variant);
    await db.SaveChangesAsync();
    return Results.Created($"/variant/{variant.Id}", variant);
});
app.Run();
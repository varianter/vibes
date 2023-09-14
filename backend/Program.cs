using backend.Database.Contexts;
using backend.DomainModels;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;

var builder = WebApplication.CreateBuilder(args);
var connection = builder.Configuration.GetConnectionString("VibesDb");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration);
builder.Services.AddAuthorization();
builder.Services.AddDbContext<ApplicationContext>(options => options.UseSqlServer(connection));


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (app.Environment.IsProduction())
    // Only use redirection in production
    app.UseHttpsRedirection();


app.UseAuthorization();

app.MapControllers();

// Temporary test-endpoints
app.MapGet("/variant", (ApplicationContext dbConext) => dbConext.Variant.ToList())
    .WithName("Varianter")
    .WithOpenApi()
    .RequireAuthorization();

app.MapGet("/variant/{id}", async (ApplicationContext db, string id) => await db.Variant.FindAsync(id))
    .RequireAuthorization();

app.MapPost("/variant", async (ApplicationContext db, Variant variant) =>
{
    await db.Variant.AddAsync(variant);
    await db.SaveChangesAsync();
    return Results.Created($"/variant/{variant.Id}", variant);
}).RequireAuthorization();


app.Run();
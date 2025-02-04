using Bogus;
using Core.Consultants;
using Core.Forecasts;
using Core.Organizations;
using Infrastructure.Repositories.Forecasts;
using Microsoft.EntityFrameworkCore;
using Tests.Api.E2E.Shared;

namespace Tests.Api.E2E;

[Collection(ApiTestCollection.CollectionName)]
public class ForecastRepositoryTests(ApiFactory apiFactory) : TestsBase(apiFactory)
{
    private static Faker _faker = new Faker();
    
    private async Task<Organization> InsertData()
    {
        var orgName = _faker.Company.CompanyName();
        var org = new Organization
        {
            Id = orgName,
            Name = orgName,
            UrlKey = orgName,
            Country = "Norway",
            NumberOfVacationDaysInYear = 25,
            HasVacationInChristmas = true,
            HoursPerWorkday = 7.5,
            Customers = [],
            AbsenceTypes = [],
            Departments =
            [
                new Department
                {
                    Id = "Trondheim",
                    Name = "Trondheim",
                    Organization = null!,
                    Consultants =
                    [
                        new Consultant
                        {
                            Name = _faker.Name.FullName(),
                            Email = _faker.Internet.Email(),
                            Department = null!
                        }
                    ]
                }
            ]
        };
        DatabaseContext.Organization.Add(org);
        await DatabaseContext.SaveChangesAsync(CancellationToken.None);

        return org;
    }

    private static Forecast CreateForecast(Organization org)
    {
        return new Forecast
        {
            ConsultantId = org.Departments[0].Consultants[0].Id,
            AdjustedValue = _faker.Random.Int(0, 90),
            Month = new DateOnly(2025, _faker.Random.Int(1, 12), 1)
        };
    }

    [Fact]
    public async Task Can_Insert_Forecast()
    {
        var org = await InsertData();
        IForecastRepository forecastRepository = new ForecastDbRepository(DatabaseContext);

        var forecast = CreateForecast(org);
        await forecastRepository.UpsertForecasts([forecast], CancellationToken.None);

        DatabaseContext.ChangeTracker.Clear();
        var forecasts = await DatabaseContext.Forecasts.ToArrayAsync(CancellationToken.None);

        Assert.Single(forecasts);
        Assert.Equivalent(forecast, forecasts[0]);
    }

    [Fact]
    public async Task Can_Update_Forecast()
    {
        var org = await InsertData();
        var forecast = CreateForecast(org);

        var updatedForecast = new Forecast
        {
            ConsultantId = forecast.ConsultantId,
            Month = forecast.Month,
            AdjustedValue = forecast.AdjustedValue + 5
        };

        DatabaseContext.Forecasts.Add(forecast);
        await DatabaseContext.SaveChangesAsync(CancellationToken.None);
        DatabaseContext.ChangeTracker.Clear();

        var repository = new ForecastDbRepository(DatabaseContext);
        var forecasts = await repository.UpsertForecasts([updatedForecast], CancellationToken.None);

        Assert.Single(forecasts);
        Assert.Equivalent(updatedForecast, forecasts[0]);
    }

    [Fact]
    public async Task Can_Update_Multiple_Forecasts()
    {
        
    }
    
    [Fact]
    public async Task Can_Insert_Multiple_Forecasts()
    {
        
    }
    
    [Fact]
    public async Task Can_Update_And_Insert_Multiple_Forecasts()
    {
        
    }
}

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
        var org = await InsertData();
        var forecast1 = CreateForecast(org);
        var forecast2 = CreateForecast(org);

        var updatedForecast1 = new Forecast {
            ConsultantId = forecast1.ConsultantId,
            Month = forecast1.Month,
            AdjustedValue = forecast1.AdjustedValue + 5
        };

        var updatedForecast2 = new Forecast {
            ConsultantId = forecast2.ConsultantId,
            Month = forecast2.Month,
            AdjustedValue = forecast2.AdjustedValue + 8
        };

        DatabaseContext.Forecasts.Add(forecast1);
        DatabaseContext.Forecasts.Add(forecast2);
        await DatabaseContext.SaveChangesAsync(CancellationToken.None);
        DatabaseContext.ChangeTracker.Clear();

        var repository = new ForecastDbRepository(DatabaseContext);
        var forecasts = await repository.UpsertForecasts([updatedForecast1, updatedForecast2], CancellationToken.None);

        Assert.Equal(2, forecasts.Length);
        Assert.Equivalent(updatedForecast1, forecasts[0]);
        Assert.Equivalent(updatedForecast2, forecasts[1]);
    }
    
    [Fact]
    public async Task Can_Insert_Multiple_Forecasts()
    {
        var org = await InsertData();
        var forecast1 = CreateForecast(org);
        var forecast2 = CreateForecast(org);

        DatabaseContext.ChangeTracker.Clear();

        var repository = new ForecastDbRepository(DatabaseContext);
        var forecasts = await repository.UpsertForecasts([ forecast1, forecast2 ], CancellationToken.None);

        Assert.Equal(2, forecasts.Length);
        Assert.Equivalent(forecast1, forecasts[0]);
        Assert.Equivalent(forecast2, forecasts[1]);
    }
    
    [Fact]
    public async Task Can_Update_And_Insert_Multiple_Forecasts()
    {
        var org = await InsertData();
        var forecast1 = CreateForecast(org);
        var forecast2 = CreateForecast(org);

        var updatedForecast1 = new Forecast {
            ConsultantId = forecast1.ConsultantId,
            Month = forecast1.Month,
            AdjustedValue = forecast1.AdjustedValue + 5
        };

        DatabaseContext.Forecasts.Add(forecast1);
        await DatabaseContext.SaveChangesAsync(CancellationToken.None);
        DatabaseContext.ChangeTracker.Clear();

        var repository = new ForecastDbRepository(DatabaseContext);
        var forecasts = await repository.UpsertForecasts([ updatedForecast1, forecast2 ], CancellationToken.None);

        Assert.Equal(2, forecasts.Length);
        Assert.Equivalent(updatedForecast1, forecasts[0]);
        Assert.Equivalent(forecast2, forecasts[1]);

    }
}

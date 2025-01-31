using Core.Forecasts;
using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Forecasts;

public class ForecastDbRepository(ApplicationContext context) : IForecastRepository
{
    public async Task<Forecast?> GetForecast(ForecastKey forecastKey, CancellationToken cancellationToken)
    {
        return await context.Forecasts
            .AsNoTracking()
            .FirstOrDefaultAsync(forecast => forecast.ForecastKey == forecastKey, cancellationToken);
    }

    public async Task<Dictionary<int, List<Forecast>>> GetForecastForConsultants(List<int> consultantIds,
        CancellationToken cancellationToken)
    {
        var forecastsByConsultant = await context.Forecasts
            .Where(f => consultantIds.Contains(f.ConsultantId))
            .GroupBy(f => f.ConsultantId)
            .ToDictionaryAsync(f => f.Key, f => f.ToList(), cancellationToken);

        return forecastsByConsultant;
    }

    public async Task<Forecast[]> AddForecastsRange(IEnumerable<Forecast> forecasts,
        CancellationToken cancellationToken)
    {
        var forecastArray = forecasts as Forecast[] ?? forecasts.ToArray();
        context.Forecasts.AddRange(forecastArray);
        await context.SaveChangesAsync(cancellationToken);
        return forecastArray;
    }

    public async Task<Forecast?> UpdateForecast(Forecast forecast, CancellationToken cancellationToken)
    {
        var existingForecast = await context.Forecasts
            .FirstOrDefaultAsync(f => f.ForecastKey == forecast.ForecastKey, cancellationToken);

        if (existingForecast is null) return null;

        context.Forecasts.Update(forecast);
        await context.SaveChangesAsync(cancellationToken);
        return forecast;
    }

    public async Task<Forecast> AddForecast(Forecast forecast, CancellationToken cancellationToken)
    {
        context.Forecasts.Add(forecast);
        await context.SaveChangesAsync(cancellationToken);
        return forecast;
    }
}

using Core.Forecasts;
using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Forecasts;

public class ForecastDbRepository(ApplicationContext context) : IForecastRepository
{
    public async Task<Forecast?> GetForecast(int consultantId, DateOnly month, CancellationToken cancellationToken)
    {
        return await context.Forecasts
            .AsNoTracking()
            .FirstOrDefaultAsync(forecast => forecast.ConsultantId == consultantId && forecast.Month == month,
                cancellationToken);
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

    public async Task<Forecast[]> UpsertForecasts(Forecast[] forecasts, CancellationToken cancellationToken)
    {
        var consultantIds = forecasts.Select(f => f.ConsultantId).ToHashSet();
        var months = forecasts.Select(f => f.Month).ToHashSet();

        var filteredForecasts = await context.Forecasts
            .AsNoTracking()
            .Where(f => consultantIds.Contains(f.ConsultantId))
            .Where(f => months.Contains(f.Month))
            .ToArrayAsync(cancellationToken);

        var doesExist = forecasts.ToLookup(f =>
            filteredForecasts.Any(k => k.ConsultantId == f.ConsultantId && k.Month == f.Month));

        context.Forecasts.UpdateRange(doesExist[true]);
        context.Forecasts.AddRange(doesExist[false]);
        await context.SaveChangesAsync(cancellationToken);

        return forecasts;
    }
}

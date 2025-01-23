using Core.Extensions;
using Core.Forecasts;
using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories.Forecasts;

public class ForecastDbRepository(ApplicationContext context) : IForecastRepository
{
	public async Task<Dictionary<int, List<Forecast>>> GetForecastForConsultants(List<int> consultantIds, CancellationToken cancellationToken)
	{
		var forecastsByConsultant = await context.Forecasts
			.Where(f => consultantIds.Contains(f.ConsultantId))
			.GroupBy(f => f.ConsultantId)
			.ToDictionaryAsync(f => f.Key, f => f.ToList(), cancellationToken);

		return forecastsByConsultant;
	}

	public async Task UpdateForecastForConsultant(int consultantId, DateOnly month, int value, CancellationToken cancellationToken)
	{
		var firstDayOfMonth = month.FirstDayInMonth();

		// TODO Forecast: Does this logic support both (A) creating/adding a non-existing object and (B) updating an existing object (found by the composite key)?
		var forecast = new Forecast
		{
			ConsultantId = consultantId,
			Month = firstDayOfMonth,
			AdjustedValue = value,
		};

		context.Forecasts.Update(forecast);

		await context.SaveChangesAsync(cancellationToken);
	}
}

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
}

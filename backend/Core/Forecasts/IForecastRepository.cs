namespace Core.Forecasts;

public interface IForecastRepository
{
	/// <summary>
	/// Gets the forecasts registered on the consultants with the given consultantId
	/// </summary>
	Task<Dictionary<int, List<Forecast>>> GetForecastForConsultants(List<int> consultantIds, CancellationToken cancellationToken);

	/// <summary>
	/// Updates the manually adjusted forecast value for the given consultant and month
	/// </summary>
	Task UpdateForecastForConsultant(int consultantId, DateOnly month, int value, CancellationToken cancellationToken);
}

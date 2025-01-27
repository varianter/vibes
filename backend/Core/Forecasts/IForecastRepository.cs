namespace Core.Forecasts;

public interface IForecastRepository
{
	/// <summary>
	/// Gets the forecasts registered on the consultants with the given consultantId
	/// </summary>
	Task<Dictionary<int, List<Forecast>>> GetForecastForConsultants(List<int> consultantIds, CancellationToken cancellationToken);
}

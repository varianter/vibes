namespace Core.Forecasts;

public interface IForecastRepository
{
	/// <summary>
	///     Gets the forecast with the given keys
	/// </summary>
	/// <returns>A <see cref="Forecast" /> if it exists, else <pre>null</pre></returns>
	public Task<Forecast?> GetForecast(int consultantId, DateOnly month, CancellationToken cancellationToken);
	
	/// <summary>
	/// Gets the forecasts registered on the consultants with the given consultantId
	/// </summary>
	public Task<Dictionary<int, List<Forecast>>> GetForecastForConsultants(List<int> consultantIds,
		CancellationToken cancellationToken);

	/// <summary>
	///     Inserts new or updates existing forecasts
	/// </summary>
	public Task<Forecast[]> UpsertForecasts(Forecast[] forecasts, CancellationToken cancellationToken);
}

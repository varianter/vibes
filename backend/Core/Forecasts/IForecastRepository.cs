namespace Core.Forecasts;

public interface IForecastRepository
{
	/// <summary>
	///     Gets the forecast with the given key
	/// </summary>
	/// <returns>A <see cref="Forecast" /> if it exists, else <pre>null</pre></returns>
	public Task<Forecast?> GetForecast(ForecastKey forecastKey, CancellationToken cancellationToken);
	
	/// <summary>
	/// Gets the forecasts registered on the consultants with the given consultantId
	/// </summary>
	public Task<Dictionary<int, List<Forecast>>> GetForecastForConsultants(List<int> consultantIds,
		CancellationToken cancellationToken);

	public Task<Forecast> AddForecast(Forecast forecast, CancellationToken cancellationToken);

	public Task<Forecast[]> AddForecastsRange(IEnumerable<Forecast> forecasts, CancellationToken cancellationToken);

	public Task<Forecast?> UpdateForecast(Forecast forecast, CancellationToken cancellationToken);
}

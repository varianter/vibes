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
	/// Gets the forecasts registered on the given consultant
	/// </summary>
	public Task<List<Forecast>> GetForecastForConsultant(int consultantId, CancellationToken cancellationToken);
	
	/// <summary>
	/// Gets the forecasts registered on the consultants with the given consultantId and during spesified months
	/// </summary>
	public Task<List<Forecast>> GetForecastForConsultantForMonthSet(int consultantId,
		CancellationToken cancellationToken, List<DateOnly> months);
	
	/// <summary>
	///     Inserts new or updates existing forecasts
	/// </summary>
	public Task<Forecast[]> UpsertForecasts(Forecast[] forecasts, CancellationToken cancellationToken);
}

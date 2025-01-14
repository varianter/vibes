namespace Core.Forecasts;

public class Forecast
{
	public required int ConsultantId { get; set; }

	public required DateOnly Month { get; set; }

	public int? AdjustedValue { get; set; }

	public ForecastKey ForecastKey => new(ConsultantId, Month);
}

public record struct ForecastKey(int ConsultantId, DateOnly Month);

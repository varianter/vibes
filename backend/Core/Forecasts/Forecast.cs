namespace Core.Forecasts;

public class Forecast
{
    public required int ConsultantId { get; init; }

    public required DateOnly Month { get; init; }

    public int? AdjustedValue { get; init; }

    public ForecastKey ForecastKey => new(ConsultantId, Month);
}

public record struct ForecastKey(int ConsultantId, DateOnly Month);

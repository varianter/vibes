namespace Core.Forecasts;

public class Forecast
{
    public required int ConsultantId { get; init; }
    public required DateOnly Month { get; init; }
    public int? AdjustedValue { get; init; }
}

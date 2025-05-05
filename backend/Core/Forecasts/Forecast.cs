using Core.Months;

namespace Core.Forecasts;

public class Forecast
{
    public required int ConsultantId { get; init; }
    public required Month Month { get; init; }
    public int? AdjustedValue { get; set; }
}

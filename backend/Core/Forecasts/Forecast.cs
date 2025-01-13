using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Forecasts;

public class Forecast
{
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public int Id { get; set; }

	public required int ConsultantId { get; set; }

	public required DateOnly MonthYear { get; set; }

	public int? AdjustedValue { get; set; }
}

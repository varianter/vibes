using System.ComponentModel.DataAnnotations.Schema;
using Core.Consultants;

namespace Core.Forecasts;

public class Forecast
{
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	public int Id { get; set; }

	public required int ConsultantId { get; set; }
	public required Consultant Consultant { get; set; }

	public DateOnly MonthYear { get; set; }

	public int OriginalValue { get; set; }
	public int? AdjustedValue { get; set; }
}

using System.ComponentModel.DataAnnotations.Schema;

namespace Core.DomainModels;

public class Forecast
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required int Id { get; set; }
    public required int ConsultantId { get; set; }
    public Consultant Consultant { get; set; } = null!;
    public required Month Month { get; set; }
    // 0-1 where 1 is 100%
    public required double MonthlyForecast { get; set; }
}

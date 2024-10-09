using System.ComponentModel.DataAnnotations;
using Core.Consultants;

namespace Core.Vacations;

public class Vacation
{
    [Required] public int Id { get; set; }

    public required int ConsultantId { get; set; }
    public required Consultant? Consultant { get; set; }
    [Required] public DateOnly Date { get; set; }
}
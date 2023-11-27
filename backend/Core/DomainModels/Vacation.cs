using System.ComponentModel.DataAnnotations;

namespace Core.DomainModels;

public class Vacation
{
    [Required] public int Id { get; set; }

    public required int ConsultantId { get; set; }
    [Required] public Consultant Consultant { get; set; }
    [Required] public DateOnly Date { get; set; }
}
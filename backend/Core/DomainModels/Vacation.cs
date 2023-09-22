using System.ComponentModel.DataAnnotations;

namespace backend.Core.DomainModels;

public class Vacation
{
    [Required] public int Id { get; set; }
    [Required] public Consultant Consultant { get; set; }
    [Required] public DateOnly Date { get; set; }
}
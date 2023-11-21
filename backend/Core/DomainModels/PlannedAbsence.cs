using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.DomainModels;

public class PlannedAbsence
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required] public Absence Absence { get; set; }
    [Required] public Consultant Consultant { get; set; }

    [Required] public Week Week { get; set; }
    public double Hours { get; set; }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.DomainModels;

public class PlannedAbsence
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required] public Absence Absence { get; set; }
    [Required] public Consultant Consultant { get; set; }
    [Required] public int Year { get; set; }
    [Required] public int WeekNumber { get; set; }
    public double Hours { get; set; }
}
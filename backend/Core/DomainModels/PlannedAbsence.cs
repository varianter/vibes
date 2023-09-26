using System.ComponentModel.DataAnnotations;

namespace backend.Core.DomainModels;

public class PlannedAbsence
{
    [Required] public Absence Absence { get; set; }
    [Required] public Consultant Consultant { get; set; }
    [Required] public int Year { get; set; }
    [Required] public int WeekNumber { get; set; }
    public double Hours { get; set; }
}
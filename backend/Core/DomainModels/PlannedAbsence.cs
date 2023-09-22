using System.ComponentModel.DataAnnotations;

namespace backend.Core.DomainModels;

public enum LeaveType
{
    Birth,
    Parental,
    ReducedHours,
    LongTermIllness
}

public class PlannedAbsence
{
    [Required] public int Id { get; set; }
    [Required] public Consultant Consultant { get; set; }
    [Required] public LeaveType Type { get; set; }
    [Required] public int Year { get; set; }
    [Required] public int WeekNumber { get; set; }
    public double Hours { get; set; }
}
using Core.Absences;
using Core.Consultants;
using Core.Weeks;

namespace Core.PlannedAbsences;

public class PlannedAbsence
{
    public required int AbsenceId { get; set; }
    public required Absence Absence { get; set; } = null!;

    public required int ConsultantId { get; set; }
    public required Consultant? Consultant { get; set; } = null!;
    public required Week Week { get; set; }
    public double Hours { get; set; } = 0;

    public PlannedAbsenceKey PlannedAbsenceKey => new(AbsenceId, ConsultantId, Week);
}

public record PlannedAbsenceKey(int AbsenceId, int ConsultantId, Week Week);
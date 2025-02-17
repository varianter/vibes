namespace Core.Consultants.Competences;

public class Competence
{
    public required string Id { get; init; }
    public required string Name { get; init; }
    public List<CompetenceConsultant> CompetenceConsultant { get; init; } = [];
}

public class CompetenceConsultant
{
    public int ConsultantId { get; init; }
    public Consultant Consultant { get; init; } = null!;
    public required string CompetencesId { get; init; }
    public Competence Competence { get; init; } = null!;
}

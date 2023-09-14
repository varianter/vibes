using System.ComponentModel.DataAnnotations.Schema;

namespace backend.DomainModels;

public class Variant
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required int Id { get; set; }

    public required string Name { get; set; }
    public required string Email { get; set; }

    public required DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }

    // TODO: Add department
    public required Department Department { get; set; }

    public required Degree Degree { get; set; }
    public required int GraduationYear { get; set; }

    public List<Competence> Competences { get; set; } = new();
}

public class Competence
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public required int Id { get; set; }

    public required string Name { get; set; }
}

public enum Degree
{
    Master,
    Bachelor,
    None
}
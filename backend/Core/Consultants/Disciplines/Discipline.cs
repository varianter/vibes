using System.Text.Json.Serialization;

namespace Core.Consultants.Disciplines;

public class Discipline
{
    public required string Id { get; init; }
    public required string Name { get; init; }
    [JsonIgnore] public List<Consultant> Consultants { get; init; } = [];
}

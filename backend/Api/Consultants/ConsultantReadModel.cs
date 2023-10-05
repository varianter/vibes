using Core.DomainModels;

namespace Api.Consultants;

public record ConsultantReadModel(int Id, string Name, string Email, List<string> Competences, string Department,
    List<BookedHoursPerWeek> Bookings, bool IsOccupied);
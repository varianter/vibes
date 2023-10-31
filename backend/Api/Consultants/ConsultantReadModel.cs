using Core.DomainModels;

namespace Api.Consultants;

public record ConsultantReadModel(int Id, string Name, string Email, List<string> Competences, string Department,
    int YearsOfExperience, Degree Degree,
    List<BookedHoursPerWeek> Bookings, bool IsOccupied);


public record BookedHoursPerWeek(int Year, int WeekNumber, BookedModel BookedHours);

public record BookedModel(double TotalBillable, double TotalOffered, double TotalPlannedAbstences, double TotalSellableTime, double TotalHolidayHours, List<ProjectModel> Bookings);

public record ProjectModel(string Name, double Hours, BookingType Type);

public enum BookingType
{
    Offer,
    Booking,
    PlannedAbsence,
    Vacation
}
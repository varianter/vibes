using Core.DomainModels;

namespace Api.Consultants;

public record ConsultantReadModel(int Id, string Name, string Email, List<string> Competences, string Department,
    int YearsOfExperience, Degree Degree,
    List<BookedHoursPerWeek> Bookings, bool IsOccupied);


public record BookedHoursPerWeek(int Year, int WeekNumber, string DateString, WeeklyBookingReadModel BookingModel);

public record WeeklyBookingReadModel(double TotalBillable, double TotalOffered, double TotalPlannedAbstences, double TotalSellableTime, double TotalHolidayHours, List<BookingReadModel> Bookings);

public record BookingReadModel(string Name, double Hours, BookingType Type);

public enum BookingType
{
    Offer,
    Booking,
    PlannedAbsence,
    Vacation
}
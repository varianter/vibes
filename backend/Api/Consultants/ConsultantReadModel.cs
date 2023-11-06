using Core.DomainModels;

namespace Api.Consultants;

public record ConsultantReadModel(int Id, string Name, string Email, List<string> Competences, string Department,
    int YearsOfExperience, Degree Degree,
    List<BookedHoursPerWeek> Bookings, List<DetailedBooking> DetailedBooking, bool IsOccupied);

public record BookedHoursPerWeek(int Year, int WeekNumber, int SortableWeek, string DateString,
    WeeklyBookingReadModel BookingModel);

public record DetailedBooking(BookingDetails BookingDetails, List<WeeklyHours> Hours);

public record WeeklyBookingReadModel(double TotalBillable, double TotalOffered, double TotalPlannedAbstences,
    double TotalSellableTime, double TotalHolidayHours, double TotalVacationHours, double TotalOverbooking);

public record BookingReadModel(string Name, double Hours, BookingType Type);

public record BookingDetails(string Name, BookingType Type);

public record WeeklyHours(int Week, double Hours);

public enum BookingType
{
    Offer,
    Booking,
    PlannedAbsence,
    Vacation
}
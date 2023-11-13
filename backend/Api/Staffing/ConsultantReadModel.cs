using Core.DomainModels;

namespace Api.Staffing;

public record ConsultantReadModel(int Id, string Name, string Email, List<string> Competences, string Department,
    int YearsOfExperience, Degree Degree,
    List<BookedHoursPerWeek> Bookings, List<DetailedBooking> DetailedBooking, bool IsOccupied);

public record BookedHoursPerWeek(int Year, int WeekNumber, int SortableWeek, string DateString,
    WeeklyBookingReadModel BookingModel);

public record DetailedBooking(BookingDetails BookingDetails, List<WeeklyHours> Hours)
{
    public DetailedBooking(string name, BookingType type, List<WeeklyHours> bookings) : this(
        new BookingDetails(name, type), bookings)
    {
    }

    private double TotalHoursForWeek(Week week)
    {
        return Hours.Where(weeklySum => weeklySum.Week == week.ToSortableInt()).Sum(weeklyHours => weeklyHours.Hours);
    }

    internal static double GetTotalHoursPrBookingTypeAndWeek(IEnumerable<DetailedBooking> list, BookingType type,
        Week week)
    {
        return list
            .Where(s => s.BookingDetails.Type == type)
            .Select(wh => wh.TotalHoursForWeek(week))
            .Sum();
    }
}

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
using Core.DomainModels;

namespace Api.StaffingController;

public record ConsultantReadModel(int Id, string Name, string Email, List<string> Competences, string Department,
    int YearsOfExperience, Degree Degree,
    List<BookedHoursPerWeek> Bookings, List<DetailedBooking> DetailedBooking, bool IsOccupied)
{
    public ConsultantReadModel(Consultant consultant, List<BookedHoursPerWeek> bookings,
        List<DetailedBooking> detailedBookings, bool IsOccupied)
        : this(
            consultant.Id,
            consultant.Name,
            consultant.Email,
            consultant.Competences.Select(c => c.Name).ToList(),
            consultant.Department.Name,
            consultant.YearsOfExperience,
            consultant.Degree ?? Degree.Master,
            bookings,
            detailedBookings,
            IsOccupied
        )
    {
    }
}

public record ConsultantReadModelSingleWeek(int Id, string Name, string Email, List<string> Competences,
    string Department,
    int YearsOfExperience, Degree Degree,
    BookedHoursPerWeek Bookings, DetailedBooking DetailedBooking, bool IsOccupied)
{
    public ConsultantReadModelSingleWeek(Consultant consultant, BookedHoursPerWeek bookings,
        DetailedBooking detailedBookings, bool IsOccupied)
        : this(
            consultant.Id,
            consultant.Name,
            consultant.Email,
            consultant.Competences.Select(c => c.Name).ToList(),
            consultant.Department.Name,
            consultant.YearsOfExperience,
            consultant.Degree ?? Degree.Master,
            bookings,
            detailedBookings,
            IsOccupied
        )
    {
    }
}

public record BookedHoursPerWeek(int Year, int WeekNumber, int SortableWeek, string DateString,
    WeeklyBookingReadModel BookingModel);

public record DetailedBooking(BookingDetails BookingDetails, List<WeeklyHours> Hours)
{
    public DetailedBooking(string projectName, BookingType type, string customerName, int projectId,
        List<WeeklyHours> bookings) : this(
        new BookingDetails(projectName, type, customerName, projectId), bookings)
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

public record BookingDetails(string ProjectName, BookingType Type, string CustomerName, int ProjectId);

public record WeeklyHours(int Week, double Hours);

public enum BookingType
{
    Offer,
    Booking,
    PlannedAbsence,
    Vacation
}
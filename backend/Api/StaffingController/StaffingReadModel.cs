using Core.Consultants;
using Core.Weeks;

// ReSharper disable NotAccessedPositionalProperty.Global

namespace Api.StaffingController;

public record StaffingReadModel(
    int Id,
    string Name,
    string Email,
    List<CompetenceReadModel> Competences,
    UpdateDepartmentReadModel Department,
    int YearsOfExperience,
    Degree Degree,
    List<BookedHoursPerWeek> Bookings,
    List<DetailedBooking> DetailedBooking,
    bool IsOccupied)
{
    public StaffingReadModel(Consultant consultant, List<BookedHoursPerWeek> bookings,
        List<DetailedBooking> detailedBookings, bool IsOccupied)
        : this(
            consultant.Id,
            consultant.Name,
            consultant.Email,
            consultant.CompetenceConsultant.Select(cc => new CompetenceReadModel(cc.Competence.Id, cc.Competence.Name))
                .ToList(),
            new UpdateDepartmentReadModel(consultant.Department.Id, consultant.Department.Name),
            consultant.YearsOfExperience,
            consultant.Degree ?? Degree.Master,
            bookings,
            detailedBookings,
            IsOccupied
        )
    {
    }
}

public record UpdateDepartmentReadModel(
    string Id,
    string Name);

public record CompetenceReadModel(
    string Id,
    string Name)
{
    public CompetenceReadModel(Competence competence)
        : this(
            competence.Id,
            competence.Name
        )
    {
    }
}

public record BookedHoursPerWeek(
    Week Week,
    string DateString,
    WeeklyBookingReadModel BookingModel);

public record DetailedBooking(
    BookingDetails BookingDetails,
    List<WeeklyHours> Hours)
{
    public double TotalHoursForWeek(Week week)
    {
        return Hours.Where(weeklySum => weeklySum.Week == week).Sum(weeklyHours => weeklyHours.Hours);
    }

    internal static double GetTotalHoursPrBookingTypeAndWeek(IEnumerable<DetailedBooking> list, BookingType type,
        Week week, bool careAboutBillable = false, bool isBillable = true)
    {
        return list
            .Where(s => s.BookingDetails.Type == type &&
                        (!careAboutBillable || s.BookingDetails.IsBillable == isBillable))
            .Select(wh => wh.TotalHoursForWeek(week))
            .Sum();
    }
}

public record WeeklyBookingReadModel(
    double TotalBillable,
    double TotalOffered,
    double TotalPlannedAbsences,
    double TotalExcludableAbsence,
    double TotalSellableTime,
    double TotalHolidayHours,
    double TotalVacationHours,
    double TotalOverbooking,
    double TotalNotStartedOrQuit);

public record BookingDetails(
    string ProjectName,
    BookingType Type,
    string CustomerName,
    int ProjectId,
    bool ExcludeFromBilling = false,
    bool IsBillable = false,
    DateTime? EndDateAgreement = null);

public record WeeklyHours(Week Week, double Hours);

public enum BookingType
{
    Offer,
    Booking,
    PlannedAbsence,
    Vacation,
    Available,
    NotStartedOrQuit
}
using Api.Common.Types;
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

public record BookedHoursPerWeek(
    int Year,
    int WeekNumber,
    int SortableWeek,
    string DateString,
    BookingReadModel BookingModel);

public record DetailedBooking(
    BookingDetails BookingDetails,
    List<WeeklyHours> Hours)
{
    public double TotalHoursForWeek(Week week)
    {
        return Hours.Where(weeklySum => weeklySum.Week == week.ToSortableInt()).Sum(weeklyHours => weeklyHours.Hours);
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

public record WeeklyHours(int Week, double Hours);

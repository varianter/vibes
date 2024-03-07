using System.ComponentModel.DataAnnotations;
using Core.DomainModels;

// ReSharper disable NotAccessedPositionalProperty.Global

namespace Api.StaffingController;

public record StaffingReadModel(
    [property: Required] int Id,
    [property: Required] string Name,
    [property: Required] string Email,
    [property: Required] List<CompetenceReadModel> Competences,
    [property: Required] UpdateDepartmentReadModel Department,
    [property: Required] int YearsOfExperience,
    [property: Required] Degree Degree,
    [property: Required] List<BookedHoursPerWeek> Bookings,
    [property: Required] List<DetailedBooking> DetailedBooking,
    [property: Required] bool IsOccupied)
{
    public StaffingReadModel(Consultant consultant, List<BookedHoursPerWeek> bookings,
        List<DetailedBooking> detailedBookings, bool IsOccupied)
        : this(
            consultant.Id,
            consultant.Name,
            consultant.Email,
            consultant.CompetenceConsultant.Select(cc => new CompetenceReadModel(cc.Competence.Id, cc.Competence.Name)).ToList(),
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
    [property: Required] string Id,
    [property: Required] string Name)
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
    [property: Required] int Year,
    [property: Required] int WeekNumber,
    [property: Required] int SortableWeek,
    [property: Required] string DateString,
    [property: Required] WeeklyBookingReadModel BookingModel);

public record DetailedBooking(
    [property: Required] BookingDetails BookingDetails,
    [property: Required] List<WeeklyHours> Hours)
{
    private double TotalHoursForWeek(Week week)
    {
        return Hours.Where(weeklySum => weeklySum.Week == week.ToSortableInt()).Sum(weeklyHours => weeklyHours.Hours);
    }

    internal static double GetTotalHoursPrBookingTypeAndWeek(IEnumerable<DetailedBooking> list, BookingType type,
        Week week, bool careAboutBillable = false, bool isBillable = true)
    {
        return list
            .Where(s => s.BookingDetails.Type == type && ( !careAboutBillable || s.BookingDetails.IsBillable == isBillable))
            .Select(wh => wh.TotalHoursForWeek(week))
            .Sum();
    }
}

public record WeeklyBookingReadModel(
    [property: Required] double TotalBillable,
    [property: Required] double TotalOffered,
    [property: Required] double TotalPlannedAbsences,
    [property: Required] double TotalSellableTime,
    [property: Required] double TotalHolidayHours,
    [property: Required] double TotalVacationHours,
    [property: Required] double TotalOverbooking);

public record BookingDetails(
    [property: Required] string ProjectName,
    [property: Required] BookingType Type,
    [property: Required] string CustomerName,
    [property: Required] int ProjectId,
    [property: Required] bool IsBillable = false);

public record WeeklyHours([property: Required] int Week, [property: Required] double Hours);

public enum BookingType
{
    Offer,
    Booking,
    PlannedAbsence,
    Vacation,
    Available
}
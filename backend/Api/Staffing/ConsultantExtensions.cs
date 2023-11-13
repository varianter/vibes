using Api.Organisation;
using Core.DomainModels;
using Core.Services;

namespace Api.Staffing;

public static class ConsultantExtensions
{
    public static ConsultantReadModel MapToReadModelList(
        this Consultant consultant,
        List<DetailedBooking> detailedBookings,
        List<Week> weekSet)
    {
        weekSet.Sort();

        var hoursPrWorkday = consultant.Department.Organization.HoursPerWorkday;
        var hoursPrWeek = hoursPrWorkday * 5;


        var bookingSummary = weekSet.Select(week =>
            GetBookedHours(week, detailedBookings, consultant)
        ).ToList();

        //isOccupied should not include offered or sellable time, as it's sometimes necessary to "double-book"
        var isOccupied = bookingSummary.All(b =>
            b.BookingModel.TotalBillable + b.BookingModel.TotalPlannedAbstences + b.BookingModel.TotalVacationHours +
            b.BookingModel.TotalHolidayHours >= hoursPrWeek);

        return new ConsultantReadModel(
            consultant.Id, consultant.Name, consultant.Email,
            consultant.Competences.Select(competence => competence.Name).ToList(),
            consultant.Department.Name,
            consultant.YearsOfExperience,
            consultant.Degree ?? Degree.Master,
            bookingSummary,
            detailedBookings.ToList(),
            isOccupied);
    }

    public static WeeklyBookingReadModel GetBookingModelForWeek(this Consultant consultant, int year, int weekNumber)
    {
        var org = consultant.Department.Organization;

        var hoursPrWorkDay = org.HoursPerWorkday;

        var week = new Week(year, weekNumber);

        var holidayHours = org.GetTotalHolidayHoursOfWeek(week);

        var vacationHours = consultant.GetVacationHoursForWeek(week);
        var plannedAbsenceHours = consultant.GetAbsenceHoursForWeek(week);
        var billableHours = consultant.GetBillableHoursForWeek(week);
        var offeredHours = consultant.GetOfferedHoursForWeek(week);

        var bookedTime = billableHours + plannedAbsenceHours + vacationHours + holidayHours;

        var totalFreeTime =
            Math.Max(hoursPrWorkDay * 5 - bookedTime, 0);

        var totalOverbooked =
            Math.Max(bookedTime - hoursPrWorkDay * 5, 0);


        return new WeeklyBookingReadModel(billableHours, offeredHours, plannedAbsenceHours, totalFreeTime, holidayHours,
            vacationHours,
            totalOverbooked);
    }

    private static string GetDatesForWeek(Week week)
    {
        return DateService.GetDatesInWorkWeek(week.Year, week.WeekNumber)[0].ToString("dd.MM") +
               " - " + DateService
                   .GetDatesInWorkWeek(week.Year, week.WeekNumber)[^1].ToString("dd.MM");
    }

    private static BookedHoursPerWeek GetBookedHours(Week week, IEnumerable<DetailedBooking> detailedBookings,
        Consultant consultant)
    {
        var totalHolidayHours = consultant.Department.Organization.GetTotalHolidayHoursOfWeek(week);

        var detailedBookingsArray = detailedBookings as DetailedBooking[] ?? detailedBookings.ToArray();
        var totalBillable =
            DetailedBooking.GetTotalHoursPrBookingTypeAndWeek(detailedBookingsArray, BookingType.Booking,
                week);

        var totalOffered = DetailedBooking.GetTotalHoursPrBookingTypeAndWeek(detailedBookingsArray,
            BookingType.Offer,
            week);

        var totalAbsence = DetailedBooking.GetTotalHoursPrBookingTypeAndWeek(detailedBookingsArray,
            BookingType.PlannedAbsence,
            week);

        var totalVacations = DetailedBooking.GetTotalHoursPrBookingTypeAndWeek(detailedBookingsArray,
            BookingType.Vacation,
            week);

        var bookedTime = totalBillable + totalAbsence + totalVacations + totalHolidayHours;
        var hoursPrWorkDay = consultant.Department.Organization.HoursPerWorkday;

        var totalFreeTime =
            Math.Max(hoursPrWorkDay * 5 - bookedTime, 0);

        var totalOverbooked =
            Math.Max(bookedTime - hoursPrWorkDay * 5, 0);

        return new BookedHoursPerWeek(
            week.Year,
            week.WeekNumber,
            week.ToSortableInt(),
            GetDatesForWeek(week),
            new WeeklyBookingReadModel(totalBillable, totalOffered, totalAbsence, totalFreeTime,
                totalHolidayHours, totalVacations,
                totalOverbooked)
        );
    }
}
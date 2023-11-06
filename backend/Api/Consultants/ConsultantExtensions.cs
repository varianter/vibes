using Api.Organisation;
using Core.DomainModels;
using Core.Services;

namespace Api.Consultants;

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

    public static WeeklyBookingReadModel GetBookingModelForWeek(this Consultant consultant, int year, int week)
    {
        var org = consultant.Department.Organization;

        var hoursPrWorkDay = org.HoursPerWorkday;

        var holidayHours = org.GetTotalHolidaysOfWeek(new Week(year, week)) * hoursPrWorkDay;
        var vacationHours = consultant.Vacations.Count(v => DateService.DateIsInWeek(v.Date, new Week(year, week))) *
                            hoursPrWorkDay;

        var plannedAbsenceHours = consultant.PlannedAbsences
            .Where(pa => pa.Year == year && pa.WeekNumber == week)
            .Select(pa => pa.Hours)
            .Sum();

        var billableHours = consultant.Staffings
            .Where(s => s.Year == year && s.Week == week && s.Project.State.Equals(ProjectState.Active))
            .Select(s => s.Hours).Sum();

        var offeredHours = consultant.Staffings
            .Where(s => s.Year == year && s.Week == week && s.Project.State.Equals(ProjectState.Offer))
            .Select(s => s.Hours).Sum();


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
using Api.Common;
using Api.Organisation;
using Core.DomainModels;

namespace Api.Staffing;

public class ReadModelFactory
{
    private readonly StorageService _storageService;

    public ReadModelFactory(StorageService storageService)
    {
        _storageService = storageService;
    }

    public List<ConsultantReadModel> GetConsultantReadModelsForWeeks(string orgUrlKey, List<Week> weeks)
    {
        var firstDayInScope = weeks.First().FirstDayOfWorkWeek();
        var firstWorkDayOutOfScope = weeks.Last().LastWorkDayOfWeek().AddDays(1);

        return _storageService.LoadConsultants(orgUrlKey)
            .Where(c => c.EndDate == null || c.EndDate > firstDayInScope)
            .Where(c => c.StartDate == null || c.StartDate <= firstWorkDayOutOfScope)
            .Select(consultant => MapToReadModelList(consultant, weeks))
            .ToList();
    }

    public static ConsultantReadModel MapToReadModelList(
        Consultant consultant,
        List<Week> weekSet)
    {
        weekSet.Sort();

        var detailedBookings = DetailedBookings(consultant, weekSet);

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
            consultant,
            bookingSummary,
            detailedBookings.ToList(),
            isOccupied);
    }


    /// <summary>
    ///     Takes in many data points collected from the DB, and joins them into a set of DetailedBookings
    ///     for a given consultant and set of weeks
    /// </summary>
    private static List<DetailedBooking> DetailedBookings(Consultant consultant,
        List<Week> weekSet)
    {
        weekSet.Sort();

        // var billableProjects = UniqueWorkTypes(projects, billableStaffing);
        var billableBookings = consultant.Staffings
            .Where(staffing => staffing.Project.State == ProjectState.Active)
            .Where(staffing => weekSet.Contains(new Week(staffing.Year, staffing.Week)))
            .GroupBy(staffing => staffing.Project.Customer.Name)
            .Select(grouping => new DetailedBooking(new BookingDetails(grouping.Key, BookingType.Booking),
                weekSet.Select(week => new WeeklyHours(
                    week.ToSortableInt(), grouping
                        .Where(staffing =>
                            new Week(staffing.Year, staffing.Week).Equals(week))
                        .Sum(staffing => staffing.Hours))).ToList()
            ));

        var offeredBookings = consultant.Staffings
            .Where(staffing => staffing.Project.State == ProjectState.Offer)
            .Where(staffing => weekSet.Contains(new Week(staffing.Year, staffing.Week)))
            .GroupBy(staffing => staffing.Project.Customer.Name)
            .Select(grouping => new DetailedBooking(new BookingDetails(grouping.Key, BookingType.Offer),
                weekSet.Select(week => new WeeklyHours(
                    week.ToSortableInt(), grouping
                        .Where(staffing =>
                            new Week(staffing.Year, staffing.Week).Equals(week))
                        .Sum(staffing => staffing.Hours))).ToList()
            ));

        var plannedAbsencesPrWeek = consultant.PlannedAbsences
            .Where(absence => weekSet.Contains(new Week(absence.Year, absence.WeekNumber)))
            .GroupBy(absence => absence.Absence.Name)
            .Select(grouping => new DetailedBooking(
                new BookingDetails(grouping.Key, BookingType.PlannedAbsence),
                weekSet.Select(week => new WeeklyHours(
                    week.ToSortableInt(),
                    grouping
                        .Where(absence =>
                            new Week(absence.Year, absence.WeekNumber).Equals(week))
                        .Sum(absence => absence.Hours)
                )).ToList()
            ));


        var detailedBookings = billableBookings.Concat(offeredBookings).Concat(plannedAbsencesPrWeek);

        var vacationsInSet =
            consultant.Vacations.Where(v => weekSet.Any(week => week.ContainsDate(v.Date)))
                .ToList();

        if (vacationsInSet.Count > 0)
        {
            var vacationsPrWeek = weekSet.Select(week => new WeeklyHours(
                week.ToSortableInt(),
                vacationsInSet.Count(vacation => week.ContainsDate(vacation.Date)) *
                consultant.Department.Organization.HoursPerWorkday
            )).ToList();
            detailedBookings = detailedBookings.Append(new DetailedBooking(
                new BookingDetails("Ferie", BookingType.Vacation),
                vacationsPrWeek));
        }

        var detailedBookingList = detailedBookings.ToList();

        // Remove empty rows
        detailedBookingList.RemoveAll(detailedBooking => detailedBooking.Hours.Sum(hours => hours.Hours) == 0);

        return detailedBookingList;
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

    private static string GetDatesForWeek(Week week)
    {
        return week.GetDatesInWorkWeek()[0].ToString("dd.MM") +
               " - " + week
                   .GetDatesInWorkWeek()[^1].ToString("dd.MM");
    }
}
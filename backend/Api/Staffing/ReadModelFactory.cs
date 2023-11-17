using Api.Common;
using Api.Organisation;
using Core.DomainModels;
using Core.Services;

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
        var firstDayInScope = DateService.FirstDayOfWorkWeek(weeks.First());
        var firstWorkDayOutOfScope = DateService.LastWorkDayOfWeek(weeks.Last()).AddDays(1);

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
            .GroupBy(staffing => staffing.Project.Name)
            .Select(grouping => new DetailedBooking(new BookingDetails(grouping.Key, BookingType.Booking, grouping.First().Project.Customer.Name),
                weekSet.Select(week => new WeeklyHours(
                    week.ToSortableInt(), grouping
                        .Where(staffing =>
                            new Week(staffing.Year, staffing.Week).ToSortableInt() == week.ToSortableInt())
                        .Sum(staffing => staffing.Hours))).ToList()
            ));

        var offeredBookings = consultant.Staffings
            .Where(staffing => staffing.Project.State == ProjectState.Offer)
            .Where(staffing => weekSet.Contains(new Week(staffing.Year, staffing.Week)))
            .GroupBy(staffing => staffing.Project.Name)
            .Select(grouping => new DetailedBooking(new BookingDetails(grouping.Key, BookingType.Offer, grouping.First().Project.Customer.Name),
                weekSet.Select(week => new WeeklyHours(
                    week.ToSortableInt(), grouping
                        .Where(staffing =>
                            new Week(staffing.Year, staffing.Week).ToSortableInt() == week.ToSortableInt())
                        .Sum(staffing => staffing.Hours))).ToList()
            ));

        var plannedAbsencesPrWeek = consultant.PlannedAbsences
            .Where(absence => weekSet.Contains(new Week(absence.Year, absence.WeekNumber)))
            .GroupBy(absence => absence.Absence.Name)
            .Select(grouping => new DetailedBooking(
                new BookingDetails(grouping.Key, BookingType.PlannedAbsence, grouping.Key),
                weekSet.Select(week => new WeeklyHours(
                    week.ToSortableInt(),
                    grouping
                        .Where(absence =>
                            new Week(absence.Year, absence.WeekNumber).ToSortableInt() == week.ToSortableInt())
                        .Sum(absence => absence.Hours)
                )).ToList()
            ));


        var detailedBookings = billableBookings.Concat(offeredBookings).Concat(plannedAbsencesPrWeek);

        var vacationsInSet =
            consultant.Vacations.Where(v => weekSet.Any(week => DateService.DateIsInWeek(v.Date, week)))
                .ToList();

        if (vacationsInSet.Count > 0)
        {
            var vacationsPrWeek = weekSet.Select(week => new WeeklyHours(
                week.ToSortableInt(),
                vacationsInSet.Count(vacation => DateService.DateIsInWeek(vacation.Date, week)) *
                consultant.Department.Organization.HoursPerWorkday
            )).ToList();
            detailedBookings = detailedBookings.Append(new DetailedBooking(
                new BookingDetails("Ferie", BookingType.Vacation, "Ferie"),
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
        return DateService.GetDatesInWorkWeek(week.Year, week.WeekNumber)[0].ToString("dd.MM") +
               " - " + DateService
                   .GetDatesInWorkWeek(week.Year, week.WeekNumber)[^1].ToString("dd.MM");
    }
}
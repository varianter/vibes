using Api.Common;
using Api.Organisation;
using Core.DomainModels;

namespace Api.StaffingController;

public class ReadModelFactory
{
    private readonly StorageService _storageService;

    public ReadModelFactory(StorageService storageService)
    {
        _storageService = storageService;
    }

    public List<StaffingReadModel> GetConsultantReadModelsForWeeks(string orgUrlKey, List<Week> weeks)
    {
        var firstDayInScope = weeks.First().FirstDayOfWorkWeek();
        var firstWorkDayOutOfScope = weeks.Last().LastWorkDayOfWeek();

        return _storageService.LoadConsultants(orgUrlKey)
            .Where(c => c.EndDate == null || c.EndDate > firstDayInScope)
            .Where(c => c.StartDate == null || c.StartDate < firstWorkDayOutOfScope)
            .Select(consultant => MapToReadModelList(consultant, weeks))
            .ToList();
    }


    public StaffingReadModel GetConsultantReadModelForWeek(int consultantId, Week week)
    {
        var consultant = _storageService.LoadConsultantForSingleWeek(consultantId, week);
        var readModel = MapToReadModelList(consultant, new List<Week> { week });

        return new StaffingReadModel(consultant, new List<BookedHoursPerWeek> { readModel.Bookings.First() },
            readModel.DetailedBooking.ToList(), readModel.IsOccupied);
    }

    public StaffingReadModel GetConsultantReadModelForWeeks(int consultantId, List<Week> weeks)
    {
        var consultant = _storageService.LoadConsultantForWeekSet(consultantId, weeks);
        var readModel = MapToReadModelList(consultant, weeks);

        return new StaffingReadModel(consultant, readModel.Bookings,
            readModel.DetailedBooking, readModel.IsOccupied);
    }

    public List<StaffingReadModel> GetConsultantReadModelForWeeks(List<int> consultantIds, List<Week> weeks)
    {
        var consultants = new List<StaffingReadModel>();
        foreach (var i in consultantIds)
        {
            var consultant = _storageService.LoadConsultantForWeekSet(i, weeks);
            var readModel = MapToReadModelList(consultant, weeks);

            consultants.Add(new StaffingReadModel(consultant, readModel.Bookings,
                readModel.DetailedBooking, readModel.IsOccupied));
        }

        return consultants;
    }

    public static StaffingReadModel MapToReadModelList(
        Consultant consultant,
        List<Week> weekSet)
    {
        weekSet.Sort();

        var detailedBookings = DetailedBookings(consultant, weekSet);

        var bookingSummary = weekSet.Select(week =>
            GetBookedHours(week, detailedBookings, consultant)
        ).ToList();

        //checks if the consultant has 0 available hours each week
        var isOccupied = bookingSummary.All(b =>
            b.BookingModel.TotalSellableTime == 0);

        return new StaffingReadModel(
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
            .Where(staffing => staffing.Engagement.State == EngagementState.Order)
            .Where(staffing => weekSet.Contains(staffing.Week))
            .GroupBy(staffing => staffing.Engagement.Id)
            .Select(grouping => new DetailedBooking(
                new BookingDetails(grouping.First().Engagement.Name, BookingType.Booking,
                    grouping.First().Engagement.Customer.Name,
                    grouping.Key, grouping.First().Engagement.IsBillable),
                weekSet.Select(week =>
                    new WeeklyHours(
                        week.ToSortableInt(), grouping
                            .Where(staffing => staffing.Week.Equals(week))
                            .Sum(staffing => staffing.Hours))
                ).ToList()
            ));

        var offeredBookings = consultant.Staffings
            .Where(staffing => staffing.Engagement.State == EngagementState.Offer)
            .Where(staffing => weekSet.Contains(staffing.Week))
            .GroupBy(staffing => staffing.Engagement.Id)
            .Select(grouping => new DetailedBooking(
                new BookingDetails(grouping.First().Engagement.Name, BookingType.Offer,
                    grouping.First().Engagement.Customer.Name,
                    grouping.Key, grouping.First().Engagement.IsBillable),
                weekSet.Select(week =>
                    new WeeklyHours(
                        week.ToSortableInt(),
                        grouping
                            .Where(staffing =>
                                staffing.Week.Equals(week))
                            .Sum(staffing => staffing.Hours))).ToList()
            ));

        var plannedAbsencesPrWeek = consultant.PlannedAbsences
            .Where(absence => weekSet.Contains(absence.Week))
            .GroupBy(absence => absence.Absence.Name)
            .Select(grouping => new DetailedBooking(
                new BookingDetails(grouping.Key, BookingType.PlannedAbsence,
                    grouping.Key,
                    grouping.First().Absence.Id), //Empty projectName as PlannedAbsence does not have a project
                weekSet.Select(week =>
                    new WeeklyHours(
                        week.ToSortableInt(),
                        grouping
                            .Where(absence =>
                                absence.Week.Equals(week))
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
                new BookingDetails("Ferie", BookingType.Vacation,
                    "Ferie",
                    0), //Empty projectName as vacation does not have a project, 0 as projectId as vacation is weird
                vacationsPrWeek));
        }

        var detailedBookingList = detailedBookings.ToList();

        return detailedBookingList;
    }

    private static BookedHoursPerWeek GetBookedHours(Week week, IEnumerable<DetailedBooking> detailedBookings,
        Consultant consultant)
    {
        var totalHolidayHours = consultant.Department.Organization.GetTotalHolidayHoursOfWeek(week);

        var detailedBookingsArray = detailedBookings as DetailedBooking[] ?? detailedBookings.ToArray();
        var totalBillable =
            DetailedBooking.GetTotalHoursPrBookingTypeAndWeek(detailedBookingsArray, BookingType.Booking,
                week, true);

        var totalNonBillable = DetailedBooking.GetTotalHoursPrBookingTypeAndWeek(detailedBookingsArray,
            BookingType.Booking,
            week, true, false);

        var totalOffered = DetailedBooking.GetTotalHoursPrBookingTypeAndWeek(detailedBookingsArray,
            BookingType.Offer,
            week);

        var totalAbsence = DetailedBooking.GetTotalHoursPrBookingTypeAndWeek(detailedBookingsArray,
            BookingType.PlannedAbsence,
            week);

        var totalVacations = DetailedBooking.GetTotalHoursPrBookingTypeAndWeek(detailedBookingsArray,
            BookingType.Vacation,
            week);

        var bookedTime = totalBillable + totalAbsence + totalVacations + totalHolidayHours + totalNonBillable;
        var hoursPrWorkDay = consultant.Department.Organization.HoursPerWorkday;

        var totalSellableTime =
            Math.Max(hoursPrWorkDay * 5 - bookedTime, 0);

        var totalOverbooked =
            Math.Max(bookedTime - hoursPrWorkDay * 5, 0);

        return new BookedHoursPerWeek(
            week.Year,
            week.WeekNumber,
            week.ToSortableInt(),
            GetDatesForWeek(week),
            new WeeklyBookingReadModel(totalBillable, totalOffered, totalAbsence, totalSellableTime,
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

    public List<StaffingReadModel> GetConsultantsReadModelsForProjectAndWeeks(string orgUrlKey, List<Week> weeks,
        int projectId)
    {
        var firstDayInScope = weeks.First().FirstDayOfWorkWeek();
        var firstWorkDayOutOfScope = weeks.Last().LastWorkDayOfWeek();

        var activeConsultants = _storageService.LoadConsultants(orgUrlKey)
            .Where(c => c.EndDate == null || c.EndDate > firstDayInScope)
            .Where(c => c.StartDate == null || c.StartDate < firstWorkDayOutOfScope)
            .Where(c => c.Staffings.Any(s => s.EngagementId == projectId && weeks.Contains(s.Week)));

        return activeConsultants
            .Select(consultant => MapToReadModelList(consultant, weeks))
            .Where(s =>
                s.DetailedBooking
                    .Any(db =>
                        db.BookingDetails.ProjectId == projectId
                        && db.BookingDetails.Type is BookingType.Booking or BookingType.Offer))
            .ToList();
    }

    public List<StaffingReadModel> GetConsultantsReadModelsForAbsenceAndWeeks(string orgUrlKey, List<Week> weeks,
        int absenceId)
    {
        var firstDayInScope = weeks.First().FirstDayOfWorkWeek();
        var firstWorkDayOutOfScope = weeks.Last().LastWorkDayOfWeek();

        var consultantsWithAbsenceInSelectedWeeks = _storageService.LoadConsultants(orgUrlKey)
            .Where(c => c.EndDate == null || c.EndDate > firstDayInScope)
            .Where(c => c.StartDate == null || c.StartDate < firstWorkDayOutOfScope)
            .Where(c =>
                c.PlannedAbsences
                    .Any(pa => pa.AbsenceId == absenceId && weeks.Contains(pa.Week)));

        return consultantsWithAbsenceInSelectedWeeks
            .Select(consultant => MapToReadModelList(consultant, weeks))
            .Where(s =>
                s.DetailedBooking
                    .Any(db => db.BookingDetails.ProjectId == absenceId
                               && db.BookingDetails.Type == BookingType.PlannedAbsence))
            .ToList();
    }


    public List<StaffingReadModel> GetConsultantsReadModelsForVacationsAndWeeks(string orgUrlKey, List<Week> weeks)
    {
        var firstDayInScope = weeks.First().FirstDayOfWorkWeek();
        var firstWorkDayOutOfScope = weeks.Last().LastWorkDayOfWeek();

        var consultantsWithAbsenceInSelectedWeeks = _storageService.LoadConsultants(orgUrlKey)
            .Where(c => c.EndDate == null || c.EndDate > firstDayInScope)
            .Where(c => c.StartDate == null || c.StartDate < firstWorkDayOutOfScope)
            .Where(c =>
                c.Vacations
                    .Any(vacation => weeks.Any(week => week.ContainsDate(vacation.Date))));

        return consultantsWithAbsenceInSelectedWeeks
            .Select(consultant => MapToReadModelList(consultant, weeks))
            .Where(s =>
                s.DetailedBooking
                    .Any(db => db.BookingDetails.Type == BookingType.Vacation))
            .ToList();
    }
}
using Api.Common;
using Api.Common.Types;
using Core.Consultants;
using Core.Engagements;
using Core.Extensions;
using Core.Weeks;

namespace Api.StaffingController;

public class ReadModelFactory(StorageService storageService)
{
    public static List<StaffingReadModel> GetConsultantReadModelsForWeeks(List<Consultant> consultants,
        List<Week> weeks)
    {
        var firstDayInScope = weeks[0].FirstDayOfWorkWeek();
        var firstWorkDayOutOfScope = weeks[^1].LastWorkDayOfWeek();

        return consultants
            .Where(c => c.EndDate == null || c.EndDate > firstDayInScope)
            .Where(c => c.StartDate == null || c.StartDate < firstWorkDayOutOfScope)
            .Select(consultant => MapToReadModelList(consultant, weeks))
            .ToList();
    }


    public StaffingReadModel GetConsultantReadModelForWeek(int consultantId, Week week)
    {
        var consultant = storageService.LoadConsultantForSingleWeek(consultantId, week);
        var readModel = MapToReadModelList(consultant, [week]);

        return new StaffingReadModel(consultant, [readModel.Bookings[0]],
            readModel.DetailedBooking.ToList(), readModel.IsOccupied);
    }

    public StaffingReadModel GetConsultantReadModelForWeeks(int consultantId, List<Week> weeks)
    {
        var consultant = storageService.LoadConsultantForWeekSet(consultantId, weeks);
        var readModel = MapToReadModelList(consultant, weeks);

        return new StaffingReadModel(consultant, readModel.Bookings,
            readModel.DetailedBooking, readModel.IsOccupied);
    }

    public List<StaffingReadModel> GetConsultantReadModelForWeeks(List<int> consultantIds, List<Week> weeks)
    {
        var consultants = new List<StaffingReadModel>();
        foreach (var i in consultantIds)
        {
            var consultant = storageService.LoadConsultantForWeekSet(i, weeks);
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
        var isOccupied = bookingSummary.All(b => b.BookingModel.TotalSellableTime.IsEqualTo(0));

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

        var billableBookings = consultant.Staffings
            .Where(staffing => staffing.Engagement.State == EngagementState.Order)
            .Where(staffing => weekSet.Contains(staffing.Week))
            .GroupBy(staffing => staffing.Engagement.Id)
            .Select(grouping => new DetailedBooking(
                new BookingDetails(grouping.First().Engagement.Name, BookingType.Booking,
                    grouping.First().Engagement.Customer.Name,
                    grouping.Key, false, grouping.First().Engagement.IsBillable, 
                    grouping.First().Engagement.Agreements.Select(a => (DateTime?)a.EndDate).DefaultIfEmpty(null).Max()),
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
                    grouping.Key, false, grouping.First().Engagement.IsBillable,
                    grouping.First().Engagement.Agreements.Select(a => (DateTime?)a.EndDate).DefaultIfEmpty(null).Max()),
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
                    grouping.First().Absence.Id, //Empty projectName as PlannedAbsence does not have a project
                    grouping.First().Absence.ExcludeFromBillRate),
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
                BookingDetails.Vacation(),
                vacationsPrWeek));
        }

        var startDate = consultant.StartDate;
        var endDate = consultant.EndDate;

        var firstDayInScope = weekSet[0].FirstDayOfWorkWeek();
        var firstWorkDayOutOfScope = weekSet[^1].LastWorkDayOfWeek();

        if (startDate > firstDayInScope)
        {
            var startWeeks = GetNonEmploymentHoursNotStartedOrQuit(startDate.Value, weekSet, consultant, false);
            detailedBookings = detailedBookings.Append(CreateNotStartedOrQuitDetailedBooking(startWeeks));
        }

        if (endDate < firstWorkDayOutOfScope)
        {
            var endWeeks = GetNonEmploymentHoursNotStartedOrQuit(endDate.Value, weekSet, consultant, true);
            detailedBookings = detailedBookings.Append(CreateNotStartedOrQuitDetailedBooking(endWeeks));
        }


        var detailedBookingList = detailedBookings.ToList();

        return detailedBookingList;
    }

    private static List<WeeklyHours> GetNonEmploymentHoursNotStartedOrQuit(DateOnly date, List<Week> weekSet,
        Consultant consultant, bool quit)
    {
        return weekSet
            .Select(week =>
            {
                var isTargetWeek = week.ContainsDate(date);

                var maxWorkHoursForWeek = consultant.Department.Organization.HoursPerWorkday * 5 -
                                          consultant.Department.Organization.GetTotalHolidayHoursOfWeek(week);

                var hoursOutsideEmployment = quit
                    ? GetNonEmployedHoursForWeekWhenQuitting(date, week, isTargetWeek, consultant)
                    : GetNonEmployedHoursForWeekWhenStarting(date, week, isTargetWeek, consultant);

                return new WeeklyHours(
                    week.ToSortableInt(), Math.Min(hoursOutsideEmployment, maxWorkHoursForWeek)
                );
            })
            .ToList();
    }

    private static double GetNonEmployedHoursForWeekWhenStarting(DateOnly startDate, Week week, bool isStartWeek,
        Consultant consultant)
    {
        var hasStarted = startDate < week.FirstDayOfWorkWeek();
        var dayDifference =
            Math.Max(
                (startDate.ToDateTime(new TimeOnly()) - week.FirstDayOfWorkWeek().ToDateTime(new TimeOnly()))
                .Days, 0);

        if (isStartWeek) return dayDifference * consultant.Department.Organization.HoursPerWorkday;
        if (!hasStarted) return consultant.Department.Organization.HoursPerWorkday * 5;
        return 0;
    }

    private static double GetNonEmployedHoursForWeekWhenQuitting(DateOnly endDate, Week week, bool isFinalWeek,
        Consultant consultant)
    {
        var hasQuit = endDate < week.FirstDayOfWorkWeek();
        var dayDifference =
            Math.Max(
                (week.LastWorkDayOfWeek().ToDateTime(new TimeOnly()) - endDate.ToDateTime(new TimeOnly())).Days,
                0);

        if (isFinalWeek) return dayDifference * consultant.Department.Organization.HoursPerWorkday;
        if (hasQuit) return consultant.Department.Organization.HoursPerWorkday * 5;
        return 0;
    }


    private static DetailedBooking CreateNotStartedOrQuitDetailedBooking(List<WeeklyHours> weeks)
    {
        return new DetailedBooking(BookingDetails.NotStartedOrQuit(), weeks);
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

        var totalNotStartedOrQuit =
            DetailedBooking.GetTotalHoursPrBookingTypeAndWeek(detailedBookingsArray, BookingType.NotStartedOrQuit,
                week);

        var totalExcludableAbsence = detailedBookingsArray
            .Where(s => s.BookingDetails is { Type: BookingType.PlannedAbsence, ExcludeFromBilling: true })
            .Select(wh => wh.TotalHoursForWeek(week))
            .Sum();

        var totalVacations = DetailedBooking.GetTotalHoursPrBookingTypeAndWeek(detailedBookingsArray,
            BookingType.Vacation,
            week);

        var bookedTime = totalBillable + totalAbsence + totalVacations + totalHolidayHours + totalNonBillable +
                         totalNotStartedOrQuit;
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
            new BookingReadModel(totalBillable, totalOffered, totalAbsence, totalExcludableAbsence,
                totalSellableTime,
                totalHolidayHours, totalVacations,
                totalOverbooked, totalNotStartedOrQuit)
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
        var firstDayInScope = weeks[0].FirstDayOfWorkWeek();
        var firstWorkDayOutOfScope = weeks[^1].LastWorkDayOfWeek();

        var activeConsultants = storageService.LoadConsultants(orgUrlKey)
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
        var firstDayInScope = weeks[0].FirstDayOfWorkWeek();
        var firstWorkDayOutOfScope = weeks[^1].LastWorkDayOfWeek();

        var consultantsWithAbsenceInSelectedWeeks = storageService.LoadConsultants(orgUrlKey)
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
        var firstDayInScope = weeks[0].FirstDayOfWorkWeek();
        var firstWorkDayOutOfScope = weeks[^1].LastWorkDayOfWeek();

        var consultantsWithAbsenceInSelectedWeeks = storageService.LoadConsultants(orgUrlKey)
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
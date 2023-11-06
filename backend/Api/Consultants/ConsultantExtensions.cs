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


    public static ConsultantReadModel MapConsultantToReadModel(this Consultant consultant, Week firstWeek, int weeks)
    {
        const double tolerance = 0.1;
        var currentYear = DateTime.Now.Year;
        var yearsOfExperience =
            currentYear - (consultant.GraduationYear is null or 0 ? currentYear : consultant.GraduationYear) ?? 0;

        var bookedHours = GetBookedHoursForWeeks(consultant, firstWeek, weeks);
        var detailedBooking = GetDetailedBooking(consultant, firstWeek, weeks);

        var isOccupied = bookedHours.All(b => b.BookingModel.TotalSellableTime <= 0 + tolerance);

        return new ConsultantReadModel(
            consultant.Id,
            consultant.Name,
            consultant.Email,
            consultant.Competences.Select(comp => comp.Name).ToList(),
            consultant.Department.Name,
            yearsOfExperience,
            consultant.Degree ?? Degree.None,
            bookedHours,
            detailedBooking,
            isOccupied
        );
    }

    private static List<DetailedBooking> GetDetailedBooking(Consultant consultant, Week firstWeek, int weeks)
    {
        var org = consultant.Department.Organization;

        var hoursPrWorkDay = org.HoursPerWorkday;

        var weeksInSet = DateService.GetNextWeeks(firstWeek, weeks);

        var projects = consultant.Staffings
            .Where(s => weeksInSet.Contains(new Week(s.Year, s.Week)))
            .Where(s => s.Project.State == ProjectState.Active || s.Project.State == ProjectState.Offer)
            .GroupBy(s => s.Project.Customer.Name)
            .Select(grouping => new DetailedBooking(
                new BookingDetails(grouping.Key,
                    grouping.First().Project.State == ProjectState.Active ? BookingType.Booking : BookingType.Offer),
                weeksInSet.Select(w => new WeeklyHours(
                    int.Parse($"{w.Year}{w.WeekNumber}"),
                    grouping
                        .Where(staffing => w.Equals(new Week(staffing.Year, staffing.Week)))
                        .Select(staffing => staffing.Hours)
                        .Sum()
                )).ToList()
            ))
            .ToList();

        var plannedAbsences = consultant.PlannedAbsences
            .Where(pa => weeksInSet.Contains(new Week(pa.Year, pa.WeekNumber)))
            .GroupBy(pa => pa.Absence.Name)
            .Select(grouping => new DetailedBooking(
                new BookingDetails(grouping.Key, BookingType.PlannedAbsence),
                weeksInSet.Select(w => new WeeklyHours(
                    int.Parse($"{w.Year}{w.WeekNumber}"),
                    grouping
                        .Where(plannedAbsence => w.Equals(new Week(plannedAbsence.Year, plannedAbsence.WeekNumber)))
                        .Select(plannedAbsence => plannedAbsence.Hours)
                        .Sum()
                )).ToList()
            ))
            .ToList();

        var detailedBookings = projects.Concat(plannedAbsences);

        var firstDay = DateService.GetDatesInWorkWeek(firstWeek.Year, firstWeek.WeekNumber).First();
        var lastDay = DateService.GetDatesInWorkWeek(weeksInSet.Last().Year, weeksInSet.Last().WeekNumber).Last();

        if (consultant.Vacations.Exists(v => v.Date >= firstDay && v.Date <= lastDay))
        {
            var vacationList = weeksInSet
                .Aggregate(new List<WeeklyHours>(), (list, week) =>
                    list.Append(new WeeklyHours(
                        int.Parse($"{week.Year}{week.WeekNumber}"),
                        consultant.Vacations.Count(v =>
                            DateService.DateIsInWeek(v.Date, week))
                        * hoursPrWorkDay)).ToList());

            var vacations = new DetailedBooking(
                new BookingDetails("Ferie", BookingType.Vacation),
                new List<WeeklyHours>(vacationList));

            detailedBookings = detailedBookings.Append(vacations).ToList();
        }

        return detailedBookings.ToList();
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

    private static List<BookedHoursPerWeek> GetBookedHoursForWeeks(this Consultant consultant, Week firstWeek,
        int weeksAhead)
    {
        var nextWeeks = DateService.GetNextWeeks(firstWeek, weeksAhead);

        return nextWeeks
            .Select(week => new BookedHoursPerWeek(
                week.Year,
                week.WeekNumber,
                int.Parse($"{week.Year}{week.WeekNumber}"),
                GetDatesForWeek(week),
                GetBookingModelForWeek(consultant, week.Year, week.WeekNumber)))
            .ToList();
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

        var totalBillable =
            DetailedBooking.GetTotalHoursPrBookingTypeAndWeek(detailedBookings, BookingType.Booking,
                week);

        var totalOffered = DetailedBooking.GetTotalHoursPrBookingTypeAndWeek(detailedBookings,
            BookingType.Offer,
            week);

        var totalAbsence = DetailedBooking.GetTotalHoursPrBookingTypeAndWeek(detailedBookings,
            BookingType.PlannedAbsence,
            week);

        var totalVacations = DetailedBooking.GetTotalHoursPrBookingTypeAndWeek(detailedBookings,
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
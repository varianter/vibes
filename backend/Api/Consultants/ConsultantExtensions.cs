using Api.Organisation;
using Core.DomainModels;
using Core.Services;

namespace Api.Consultants;

public static class ConsultantExtensions
{
    public static ConsultantReadModel MapConsultantToReadModel(this Consultant consultant, Week firstWeek, int weeks)
    {
        const double tolerance = 0.1;
        var currentYear = DateTime.Now.Year;
        var yearsOfExperience =
            currentYear - (consultant.GraduationYear is null or 0 ? currentYear : consultant.GraduationYear) ?? 0;

        var bookedHours = GetBookedHoursForWeeks(consultant, firstWeek, weeks);

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
            isOccupied
        );
    }

    public static WeeklyBookingReadModel GetBookingModelForWeek(this Consultant consultant, int year, int week)
    {
        var org = consultant.Department.Organization;

        var hoursPrWorkDay = org.HoursPerWorkday;

        var holidayHours = org.GetTotalHolidaysOfWeek(year, week) * hoursPrWorkDay;
        var vacationHours = consultant.Vacations.Count(v => DateService.DateIsInWeek(v.Date, year, week)) *
                            hoursPrWorkDay;

        var plannedAbsenceHours = consultant.PlannedAbsences
            .Where(pa => pa.Year == year && pa.WeekNumber == week)
            .Select(pa => pa.Hours)
            .Sum();

        var staffings = consultant.Staffings
            .Where(s => s.Year == year && s.Week == week && s.Project.State.Equals(ProjectState.Active))
            .Select(s => new BookingReadModel(s.Project.Customer.Name, s.Hours, BookingType.Booking)).ToList();

        var offers = consultant.Staffings
            .Where(s => s.Year == year && s.Week == week && s.Project.State.Equals(ProjectState.Offer))
            .Select(s => new BookingReadModel(s.Project.Customer.Name, s.Hours, BookingType.Offer)).ToList();

        var plannedAbsences = consultant.PlannedAbsences
            .Where(s => s.Year == year && s.WeekNumber == week)
            .Select(s => new BookingReadModel(s.Absence.Name, s.Hours, BookingType.PlannedAbsence)).ToList();

        var bookingList = staffings.Concat(offers).Concat(plannedAbsences).ToList();

        if (vacationHours > 0)
        {
            var vacation = new BookingReadModel("Ferie", vacationHours, BookingType.Vacation);
            bookingList = bookingList.Append(vacation).ToList();
        }

        var billableHours = staffings.Select(s => s.Hours).Sum();
        var offeredHours = offers.Select(s => s.Hours).Sum();

        var bookedTime = billableHours + plannedAbsenceHours + vacationHours + holidayHours;


        var totalFreeTime =
            Math.Max(hoursPrWorkDay * 5 - bookedTime, 0);

        var totalOverbooked =
            Math.Max(bookedTime - hoursPrWorkDay * 5, 0);


        return new WeeklyBookingReadModel(billableHours, offeredHours, plannedAbsenceHours, totalFreeTime, holidayHours, vacationHours, 
           totalOverbooked, bookingList);
    }

    private static List<BookedHoursPerWeek> GetBookedHoursForWeeks(this Consultant consultant, Week firstWeek,
        int weeksAhead)
    {
        var nextWeeks = DateService.GetNextWeeks(firstWeek, weeksAhead);
        var datestring = DateService.GetDatesInWorkWeek(firstWeek.Year, firstWeek.WeekNumber)[0].ToString("dd.MM") +
                         "-" + DateService
                             .GetDatesInWorkWeek(firstWeek.Year, firstWeek.WeekNumber)[^1].ToString("dd.MM");

        return nextWeeks
            .Select(week => new BookedHoursPerWeek(
                week.Year,
                week.WeekNumber,
                datestring,
                GetBookingModelForWeek(consultant, week.Year, week.WeekNumber)))
            .ToList();
    }
}
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
            .Where(s=> s.Project.State == ProjectState.Active || s.Project.State == ProjectState.Offer)
            .GroupBy(s => s.Project.Customer.Name)
            .Select(grouping => new DetailedBooking(
                new BookingDetails(grouping.Key, grouping.First().Project.State==ProjectState.Active ? BookingType.Booking : BookingType.Offer),
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
            .GroupBy(pa=> pa.Absence.Name)
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
                            DateService.DateIsInWeek(v.Date, week.Year, week.WeekNumber)) 
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

        var holidayHours = org.GetTotalHolidaysOfWeek(year, week) * hoursPrWorkDay;
        var vacationHours = consultant.Vacations.Count(v => DateService.DateIsInWeek(v.Date, year, week)) *
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
        var datestring = DateService.GetDatesInWorkWeek(firstWeek.Year, firstWeek.WeekNumber)[0].ToString("dd.MM") +
                         " - " + DateService
                             .GetDatesInWorkWeek(firstWeek.Year, firstWeek.WeekNumber)[^1].ToString("dd.MM");

        return nextWeeks
            .Select(week => new BookedHoursPerWeek(
                week.Year,
                week.WeekNumber,
                int.Parse($"{week.Year}{week.WeekNumber}"),
                datestring,
                GetBookingModelForWeek(consultant, week.Year, week.WeekNumber)))
            .ToList();
    }

}
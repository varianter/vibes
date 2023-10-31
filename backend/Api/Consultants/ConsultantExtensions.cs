using Api.Organisation;
using Core.DomainModels;
using Core.Services;

namespace Api.Consultants;

public static class ConsultantExtensions
{
    public static ConsultantReadModel MapConsultantToReadModel(this Consultant consultant, int weeks)
    {
        const double tolerance = 0.1;
        var currentYear = DateTime.Now.Year;
        var yearsOfExperience =
            currentYear - (consultant.GraduationYear is null or 0 ? currentYear : consultant.GraduationYear) ?? 0;

        var bookedHours = GetBookedHoursForWeeks(consultant, weeks);

        var isOccupied = bookedHours.All(b => b.BookedHours.TotalSellableTime <= 0 + tolerance);

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

    public static BookedModel GetBookedHours(this Consultant consultant, int year, int week)
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
            .Select(s => new ProjectModel(s.Project.Customer.Name, s.Hours, BookingType.Booking)).ToList();

        var offers = consultant.Staffings
            .Where(s => s.Year == year && s.Week == week && s.Project.State.Equals(ProjectState.Offer))
            .Select(s => new ProjectModel(s.Project.Customer.Name, s.Hours, BookingType.Offer)).ToList();

        var plannedAbsences = consultant.PlannedAbsences
            .Where(s => s.Year == year && s.WeekNumber == week)
            .Select(s => new ProjectModel(s.Absence.Name, s.Hours, BookingType.PlannedAbsence)).ToList();

        var combinedList = staffings.Concat(offers).Concat(plannedAbsences).ToList();

        if (vacationHours > 0)
        {
            var vacation = new ProjectModel("Ferie", vacationHours, BookingType.Vacation);
            combinedList = combinedList.Append(vacation).ToList();
        }

        var billableHours = staffings.Select(s => s.Hours).Sum();
        var offeredHours = offers.Select(s => s.Hours).Sum();


        var totalFreeTime =
            Math.Max(hoursPrWorkDay * 5 - billableHours - plannedAbsenceHours - vacationHours - holidayHours, 0);


        return new BookedModel(billableHours, offeredHours, plannedAbsenceHours, totalFreeTime, holidayHours,
            combinedList);
    }

    private static List<BookedHoursPerWeek> GetBookedHoursForWeeks(this Consultant consultant, int weeksAhead)
    {
        return Enumerable.Range(0, weeksAhead)
            .Select(offset =>
            {
                var year = DateTime.Today.AddDays(7 * offset).Year;
                var week = DateService.GetWeekAhead(offset);

                return new BookedHoursPerWeek(
                    year,
                    week,
                    GetBookedHours(consultant, year, week)
                );
            })
            .ToList();
    }

    private static double GetHoursPrWeek(this Consultant consultant)
    {
        return consultant.Department.Organization.HoursPerWorkday * 5;
    }
}
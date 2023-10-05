using Api.Options;
using Core.DomainModels;
using Core.Services;
using Microsoft.Extensions.Options;

namespace Api.Consultants;

public class ConsultantService
{
    private readonly HolidayService _holidayService;
    private readonly OrganizationOptions _organizationOptions;

    public ConsultantService(IOptions<OrganizationOptions> orgOptions, HolidayService holidayService)
    {
        _organizationOptions = orgOptions.Value;
        _holidayService = holidayService;
    }

    public ConsultantReadModel MapConsultantToReadModel(Consultant consultant, int weeks)
    {
        const double tolerance = 0.1;
        var bookedHours = GetBookedHoursForWeeks(consultant, weeks);

        var isOccupied = bookedHours.All(b => b.BookedHours >= GetHoursPrWeek() - tolerance);

        return new ConsultantReadModel(
            consultant.Id,
            consultant.Name,
            consultant.Email,
            consultant.Competences.Select(comp => comp.Name).ToList(),
            consultant.Department.Name,
            bookedHours,
            isOccupied
        );
    }

    public double GetBookedHours(Consultant consultant, int year, int week)
    {
        var hoursPrWorkDay = _organizationOptions.HoursPerWorkday;

        var holidayHours = _holidayService.GetTotalHolidaysOfWeek(year, week) * hoursPrWorkDay;
        var vacationHours = consultant.Vacations.Count(v => DateService.DateIsInWeek(v.Date, year, week)) *
                            hoursPrWorkDay;

        var plannedAbsenceHours = consultant.PlannedAbsences
            .Where(pa => pa.Year == year && pa.WeekNumber == week)
            .Select(pa => pa.Hours)
            .Sum();

        var staffedHours = consultant.Staffings
            .Where(s => s.Year == year && s.Week == week)
            .Select(s => s.Hours)
            .Sum();

        var bookedHours = holidayHours + vacationHours + plannedAbsenceHours + staffedHours;
        return Math.Min(bookedHours, 5 * hoursPrWorkDay);
    }

    public List<BookedHoursPerWeek> GetBookedHoursForWeeks(Consultant consultant, int weeksAhead)
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

    public double GetHoursPrWeek()
    {
        return _organizationOptions.HoursPerWorkday * 5;
    }
}
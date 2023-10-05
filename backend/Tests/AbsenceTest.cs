using Api.Consultants;
using Api.Options;
using Core.DomainModels;
using Core.Services;
using Microsoft.Extensions.Options;
using NSubstitute;

namespace Tests;

public class Tests
{
    [TestCase(2, 15, 0, 0, 30)]
    [TestCase(0, 7.5, 0, 0, 7.5)]
    [TestCase(5, 37.5, 0, 0, 37.5)]
    [TestCase(0, 0, 0, 0, 0)]
    [TestCase(5, 30, 0, 0, 37.5)]
    [TestCase(5, 0, 0, 0, 37.5)]
    [TestCase(5, 37.5, 0, 0, 37.5)]
    [TestCase(0, 0, 1, 0, 7.5)]
    [TestCase(0, 0, 2, 0, 15)]
    [TestCase(0, 0, 5, 0, 37.5)]
    [TestCase(0, 0, 0, 37.5, 37.5)]
    [TestCase(0, 0, 0, 30, 30)]
    [TestCase(0, 7.5, 0, 22.5, 30)]
    public void AvailabilityCalculation(int vacationDays, double plannedAbsenceHours, int numberOfHolidays,
        double staffedHours,
        double expectedBookedHours)
    {
        var department = Substitute.For<Department>();
        var consultant = new Consultant
        {
            Id = 1,
            Name = "Test Variant",
            Email = "tv@v.no",
            Department = department
        };

        var mondayDateOnly = numberOfHolidays switch
        {
            0 => new DateOnly(2023, 9, 4), // Week 36, 4th Sept 2023, (no public holidays)
            1 => new DateOnly(2023, 4, 10), // Week 15, 10-14th May 2023 (2.påskedag)
            2 => new DateOnly(2023, 4, 3), // Week 14, 3-7th April 2023 (Skjærtorsdag + Langfredag)
            5 => new DateOnly(2022, 12, 26), // Week 52, 26th-30th Descember (Variant Juleferie)
            _ => throw new Exception("Number of holidays can only be set to 0,1,2 or 5")
        };

        var year = mondayDateOnly.Year;
        var month = mondayDateOnly.Month;
        var monday = mondayDateOnly.Day;
        var week = DateService.GetWeekNumber(mondayDateOnly.ToDateTime(TimeOnly.Parse("12:00")));

        if (vacationDays > 0)
            for (var i = 0; i < vacationDays; i++)
                consultant.Vacations.Add(new Vacation
                {
                    Consultant = consultant,
                    // Note that this calculation is not taking into account WHICH day, but estimated weekSummary
                    Date = new DateOnly(year, month, monday + i)
                });

        if (plannedAbsenceHours > 0)
            consultant.PlannedAbsences.Add(new PlannedAbsence
            {
                Consultant = consultant, Year = year, WeekNumber = week,
                Hours = plannedAbsenceHours
            });

        if (staffedHours > 0)
            consultant.Staffings.Add(new Staffing
            {
                Project = Substitute.For<Project>(),
                Consultant = consultant,
                Year = year,
                Week = week,
                Hours = staffedHours
            });

        var organization = new OrganizationOptions();
        organization.HoursPerWorkday = 7.5;
        organization.HasVacationInChristmas = true;
        var orgOptions = Options.Create(organization);
        var holidayService = new HolidayService(orgOptions);

        var bookedHours =
            new ConsultantService(orgOptions, holidayService).GetBookedHours(consultant, year, week);
        Assert.That(bookedHours, Is.EqualTo(expectedBookedHours));
    }

    [Test]
    public void MultiplePlannedAbsences()
    {
        var department = Substitute.For<Department>();
        var consultant = new Consultant
        {
            Id = 1,
            Name = "Test Variant",
            Email = "tv@v.no",
            Department = department
        };


        const int year = 2000;
        const int week = 1;

        consultant.PlannedAbsences.Add(new PlannedAbsence
        {
            Consultant = consultant, Year = year, WeekNumber = week,
            Hours = 15
        });

        consultant.PlannedAbsences.Add(new PlannedAbsence
        {
            Consultant = consultant, Year = year, WeekNumber = week,
            Hours = 15
        });

        var organization = new OrganizationOptions();
        organization.HoursPerWorkday = 7.5;
        var orgOptions = Options.Create(organization);
        var holidayService = new HolidayService(orgOptions);

        var bookedHours =
            new ConsultantService(orgOptions, holidayService).GetBookedHours(consultant, year, week);

        Assert.That(bookedHours, Is.EqualTo(30));
    }
}
using backend.Core.DomainModels;
using backend.Core.Services;
using Microsoft.VisualBasic;
using NSubstitute;

namespace Tests;

public class Tests
{
    [TestCase(2, 15, 0, 7.5)]
    [TestCase(0, 7.5, 0, 30)]
    [TestCase(5, 37.5, 0, 0)]
    [TestCase(0, 0, 0, 37.5)]
    [TestCase(5, 30, 0, 0)]
    [TestCase(5, 0, 0, 0)]
    [TestCase(5, 37.5, 0, 0)]
    [TestCase(0, 0, 1, 30.0)]
    [TestCase(0, 0, 2, 22.5)]
    [TestCase(0, 0, 5, 0)]
    public void AvailabilityCalculation(int vacationDays, double plannedAbsenceHours, int numberOfHolidays,
        double expectedAvailability)
    {
        var department = Substitute.For<Department>();
        var organization = Substitute.For<Organization>();
        organization.HoursPerWorkday = 7.5;
        department.Organization = organization;
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
        var day = mondayDateOnly.Day;
        var week = DateService.GetWeekNumber(mondayDateOnly.ToDateTime(TimeOnly.Parse("12:00")));

        if (vacationDays > 0)
            for (var i = 0; i < vacationDays; i++)
                consultant.Vacations.Add(new Vacation
                {
                    Consultant = consultant,
                    Date = new DateOnly(year, month, day + numberOfHolidays + i)
                });

        if (plannedAbsenceHours > 0)
            consultant.PlannedAbsences.Add(new PlannedAbsence
            {
                Consultant = consultant, Year = year, WeekNumber = week,
                Hours = plannedAbsenceHours
            });

        var availability = consultant.GetAvailableHours(year, week);
        Assert.That(availability, Is.EqualTo(expectedAvailability));
    }

    [Test]
    public void MultiplePlannedAbsences()
    {
        var department = Substitute.For<Department>();
        var organization = Substitute.For<Organization>();
        organization.HoursPerWorkday = 7.5;
        department.Organization = organization;
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

        var availability = consultant.GetAvailableHours(year, week);
        Assert.That(availability, Is.EqualTo(7.5));
    }
}
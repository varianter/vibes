using backend.Core.DomainModels;
using NSubstitute;

namespace Tests;

public class Tests
{
    [TestCase(2, 15, 7.5)]
    [TestCase(0, 7.5, 30)]
    [TestCase(5, 37.5, 0)]
    [TestCase(0, 0, 37.5)]
    [TestCase(5, 30, 0)]
    [TestCase(5, 0, 0)]
    [TestCase(5, 37.5, 0)]
    public void AvailabilityCalculation(int vacationDays, double plannedAbsenceHours,
        double expectedAvailability)
    {
        var department = Substitute.For<Department>();
        var organization = Substitute.For<Organization>();
        organization.HoursPerWorkday = (float)7.5;
        department.Organization = organization;
        var consultant = new Consultant
        {
            Id = 1,
            Name = "Test Variant",
            Email = "tv@v.no",
            Department = department
        };

        const int year = 2000;
        const int month = 1;
        const int week = 1;

        if (vacationDays > 0)
            for (var i = 0; i < vacationDays; i++)
                consultant.Vacations.Add(new Vacation
                {
                    Consultant = consultant,
                    Date = new DateOnly(year, month, i + 3)
                }); // Monday week 1, jan 3rd 2000

        if (plannedAbsenceHours > 0)
            consultant.PlannedAbsences.Add(new PlannedAbsence
            {
                Id = 1, Consultant = consultant, Type = LeaveType.Parental, Year = year, WeekNumber = week,
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
        organization.HoursPerWorkday = (float)7.5;
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
            Id = 1, Consultant = consultant, Type = LeaveType.Birth, Year = year, WeekNumber = week,
            Hours = 15
        });

        consultant.PlannedAbsences.Add(new PlannedAbsence
        {
            Id = 1, Consultant = consultant, Type = LeaveType.Parental, Year = year, WeekNumber = week,
            Hours = 15
        });

        var availability = consultant.GetAvailableHours(year, week);
        Assert.That(availability, Is.EqualTo(7.5));
    }
}
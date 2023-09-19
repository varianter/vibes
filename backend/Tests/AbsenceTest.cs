using backend.ApplicationCore.DomainModels;
using NSubstitute;

namespace Tests;

public class Tests
{
    [TestCase(2, 5, 0.2, 0.48)]
    [TestCase(0, 5, 0.2, 0.8)]
    [TestCase(2, 5, 0, 0.6)]
    [TestCase(0, 5, 0, 1)]
    [TestCase(5, 5, 0.8, 0)]
    [TestCase(0, 5, 1, 0)]
    [TestCase(5, 5, 0, 0)]
    [TestCase(5, 5, 1, 0)]
    [TestCase(0, 4, 0.2, 0.84)]
    public void AvailabilityCalculation(int vacationDays, int applicableDays, double plannedAbsenceFraction,
        double expectedAvailability)
    {
        var consultant = new Consultant
        {
            Id = 1,
            Name = "Test Variant",
            Email = "tv@v.no",
            Department = Substitute.For<Department>()
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

        if (plannedAbsenceFraction > 0)
            consultant.PlannedAbsences.Add(new PlannedAbsence
            {
                Id = 1, Consultant = consultant, Type = LeaveType.Parental, Year = year, WeekNumber = week,
                ApplicableDays = applicableDays,
                Fraction = plannedAbsenceFraction
            });

        var availability = consultant.GetAvailabilityFraction(year, week);
        Assert.That(availability, Is.EqualTo(expectedAvailability));
    }

    [Test]
    public void MultiplePlannedAbsences()
    {
        var consultant = new Consultant
        {
            Id = 1,
            Name = "Test Variant",
            Email = "tv@v.no",
            Department = Substitute.For<Department>()
        };

        const int year = 2000;
        const int week = 1;

        consultant.PlannedAbsences.Add(new PlannedAbsence
        {
            Id = 1, Consultant = consultant, Type = LeaveType.Birth, Year = year, WeekNumber = week,
            ApplicableDays = 2,
            Fraction = 1
        });

        consultant.PlannedAbsences.Add(new PlannedAbsence
        {
            Id = 1, Consultant = consultant, Type = LeaveType.Parental, Year = year, WeekNumber = week,
            ApplicableDays = 2,
            Fraction = 1
        });

        var availability = consultant.GetAvailabilityFraction(year, week);
        Assert.That(availability, Is.EqualTo(0.2));
    }
}
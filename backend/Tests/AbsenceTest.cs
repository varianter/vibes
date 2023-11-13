using Api.Staffing;
using Core.DomainModels;
using Core.Services;
using NSubstitute;

namespace Tests;

public class Tests
{
    [TestCase(2, 15, 0, 0, 7.5)]
    [TestCase(0, 7.5, 0, 0, 30)]
    [TestCase(5, 37.5, 0, 0, 0)]
    [TestCase(0, 0, 0, 0, 37.5)]
    [TestCase(5, 30, 0, 0, 0)]
    [TestCase(5, 0, 0, 0, 0)]
    [TestCase(5, 37.5, 0, 0, 0)]
    [TestCase(0, 0, 1, 0, 30)]
    [TestCase(0, 0, 2, 0, 22.5)]
    [TestCase(0, 0, 5, 0, 0)]
    [TestCase(0, 0, 0, 37.5, 0)]
    [TestCase(0, 0, 0, 30, 7.5)]
    [TestCase(0, 7.5, 0, 22.5, 7.5)]
    public void AvailabilityCalculation(int vacationDays, double plannedAbsenceHours, int numberOfHolidays,
        double staffedHours,
        double expectedSellableHours)
    {
        var org = new Organization
        {
            Id = "konsulent-as",
            Name = "Konsulent as",
            UrlKey = "konsulent-as",
            Country = "norway",
            NumberOfVacationDaysInYear = 25,
            HoursPerWorkday = 7.5,
            Departments = new List<Department>(),
            HasVacationInChristmas = true,
            Customers = new List<Customer>()
        };

        var department = new Department
        {
            Id = "barteby",
            Name = "Barteby",
            Hotkey = 1,
            Organization = org,
            Consultants = Substitute.For<List<Consultant>>()
        };


        Consultant consultant = new()
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
        var weekNumber = DateService.GetWeekNumber(mondayDateOnly.ToDateTime(TimeOnly.Parse("12:00")));
        var week = new Week(year, weekNumber);
        var project = Substitute.For<Project>();
        var customer = Substitute.For<Customer>();
        customer.Name = "TestCustomer";
        project.Customer = customer;
        project.State = ProjectState.Active;

        var detailedBookings = new List<DetailedBooking>();

        if (vacationDays > 0)
            detailedBookings.Add(new DetailedBooking(new BookingDetails("Ferie", BookingType.Vacation),
                new List<WeeklyHours> { new(week.ToSortableInt(), vacationDays * 7.5) }));

        if (plannedAbsenceHours > 0)
            detailedBookings.Add(new DetailedBooking(new BookingDetails("Perm", BookingType.PlannedAbsence),
                new List<WeeklyHours> { new(week.ToSortableInt(), plannedAbsenceHours) }));

        if (staffedHours > 0)
            detailedBookings.Add(new DetailedBooking(new BookingDetails("Kundenavn", BookingType.Booking),
                new List<WeeklyHours> { new(week.ToSortableInt(), staffedHours) }));

        var bookingModel = ReadModelFactory.MapToReadModelList(consultant, new List<Week> { week }).Bookings.First()
            .BookingModel;

        Assert.Multiple(() =>
        {
            Assert.That(bookingModel.TotalBillable, Is.EqualTo(staffedHours));
            Assert.That(bookingModel.TotalPlannedAbstences, Is.EqualTo(plannedAbsenceHours));
            Assert.That(bookingModel.TotalHolidayHours, Is.EqualTo(numberOfHolidays * 7.5));
            Assert.That(bookingModel.TotalSellableTime, Is.EqualTo(expectedSellableHours));
        });
    }

    [Test]
    public void MultiplePlannedAbsences()
    {
        var org = new Organization
        {
            Id = "konsulent-as",
            Name = "Konsulent as",
            UrlKey = "konsulent-as",
            Country = "norway",
            NumberOfVacationDaysInYear = 25,
            HoursPerWorkday = 7.5,
            HasVacationInChristmas = false,
            Customers = new List<Customer>()
        };

        var department = new Department
        {
            Id = "barteby",
            Name = "Barteby",
            Hotkey = 1,
            Organization = org,
            Consultants = Substitute.For<List<Consultant>>()
        };

        var leaveA = Substitute.For<Absence>();
        var leaveB = Substitute.For<Absence>();


        var consultant = new Consultant
        {
            Id = 1,
            Name = "Test Variant",
            Email = "tv@v.no",
            Department = department
        };

        var week = new Week(2000, 1);

        consultant.PlannedAbsences.Add(new PlannedAbsence
        {
            Absence = leaveA,
            Consultant = consultant,
            Year = week.Year,
            WeekNumber = week.WeekNumber,
            Hours = 15
        });

        consultant.PlannedAbsences.Add(new PlannedAbsence
        {
            Absence = leaveB,
            Consultant = consultant,
            Year = week.Year,
            WeekNumber = week.WeekNumber,
            Hours = 15
        });

        var bookedHours = ReadModelFactory.MapToReadModelList(consultant, new List<Week> { week }).Bookings.First()
            .BookingModel;

        Assert.That(bookedHours.TotalPlannedAbstences, Is.EqualTo(30));
    }
}
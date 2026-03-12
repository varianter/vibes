using Api.StaffingController;
using Core.Absences;
using Core.Consultants;
using Core.Customers;
using Core.Engagements;
using Core.Organizations;
using Core.PlannedAbsences;
using Core.Staffings;
using Core.Vacations;
using Core.Weeks;
using NSubstitute;

namespace Tests.Core.Tests;

public class AbsenceTests
{
    [Theory]
    [InlineData(2, 15, 0, 0, 7.5)]
    [InlineData(0, 7.5, 0, 0, 30)]
    [InlineData(5, 37.5, 0, 0, 0)]
    [InlineData(0, 0, 0, 0, 37.5)]
    [InlineData(5, 30, 0, 0, 0)]
    [InlineData(5, 0, 0, 0, 0)]
    [InlineData(0, 0, 1, 0, 30)]
    [InlineData(0, 0, 2, 0, 22.5)]
    [InlineData(0, 0, 5, 0, 0)]
    [InlineData(0, 0, 0, 37.5, 0)]
    [InlineData(0, 0, 0, 30, 7.5)]
    [InlineData(0, 7.5, 0, 22.5, 7.5)]
    public void AvailabilityCalculation(
        int vacationDays,
        double plannedAbsenceHours,
        int numberOfHolidays,
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
            Departments = [],
            HasVacationInChristmas = true,
            HasVacationOnChristmasEveAndNewYearsEve = false,
            Customers = [],
            AbsenceTypes = []
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
            GraduationYear = 2010,
            Department = department
        };

        var mondayDateOnly = numberOfHolidays switch
        {
            0 => new DateOnly(2023, 9, 4), // Week 36, 4th Sept 2023, (no public holidays)
            1 => new DateOnly(2023, 4, 10), // Week 15, 10-14th May 2023 (2.påskedag)
            2 => new DateOnly(2023, 4, 3), // Week 14, 3-7th April 2023 (Skjærtorsdag + Langfredag)
            5 => new DateOnly(2022, 12, 26), // Week 52, 26th-30th December (Variant Juleferie)
            _ => throw new Exception("Number of holidays can only be set to 0,1,2 or 5")
        };

        var week = Week.FromDateOnly(mondayDateOnly);
        var project = Substitute.For<Engagement>();
        var customer = Substitute.For<Customer>();
        customer.Name = "TestCustomer";
        project.Customer = customer;
        project.State = EngagementState.Order;
        project.IsBillable = true;


        for (var i = 0; i < vacationDays; i++)
            consultant.Vacations.Add(new Vacation
            {
                ConsultantId = consultant.Id,
                Consultant = consultant,
                Date = mondayDateOnly.AddDays(i)
            });


        if (plannedAbsenceHours > 0)
            consultant.PlannedAbsences.Add(new PlannedAbsence
            {
                Absence = Substitute.For<Absence>(),
                Consultant = consultant,
                Hours = plannedAbsenceHours,
                Week = week,
                AbsenceId = Substitute.For<Absence>().Id,
                ConsultantId = consultant.Id
            });

        if (staffedHours > 0)
            consultant.Staffings.Add(new Staffing
            {
                Engagement = project,
                Consultant = consultant,
                Hours = staffedHours,
                Week = week,
                EngagementId = project.Id,
                ConsultantId = consultant.Id
            });

        var bookingModel = ReadModelFactory.MapToReadModelList(consultant, [week]).Bookings[0]
            .BookingModel;


        Assert.Equal(staffedHours, bookingModel.TotalBillable);
        Assert.Equal(plannedAbsenceHours, bookingModel.TotalPlannedAbsences);
        Assert.Equal(numberOfHolidays * 7.5, bookingModel.TotalHolidayHours);
        Assert.Equal(expectedSellableHours, bookingModel.TotalSellableTime);
    }

    [Fact]
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
            HasVacationOnChristmasEveAndNewYearsEve = false,
            Customers = [],
            AbsenceTypes = []
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
            GraduationYear = 2010,
            Department = department
        };

        var week = new Week(2000, 1);

        consultant.PlannedAbsences.Add(new PlannedAbsence
        {
            Absence = leaveA,
            Consultant = consultant,
            Hours = 15,
            Week = week,
            AbsenceId = leaveA.Id,
            ConsultantId = consultant.Id
        });

        consultant.PlannedAbsences.Add(new PlannedAbsence
        {
            Absence = leaveB,
            Consultant = consultant,
            Hours = 15,
            Week = week,
            AbsenceId = leaveB.Id,
            ConsultantId = consultant.Id
        });

        var bookedHours = ReadModelFactory.MapToReadModelList(consultant, [week]).Bookings[0]
            .BookingModel;

        Assert.Equal(30, bookedHours.TotalPlannedAbsences);
    }

    private static Organization CreateOrgWithPartialChristmas() => new Organization
    {
        Id = "konsulent-as",
        Name = "Konsulent as",
        UrlKey = "konsulent-as",
        Country = "norway",
        NumberOfVacationDaysInYear = 25,
        HoursPerWorkday = 7.5,
        HasVacationInChristmas = false,
        HasVacationOnChristmasEveAndNewYearsEve = true,
        Customers = [],
        AbsenceTypes = []
    };

    [Fact]
    public void WeekWithChristmasEve_HasOneHoliday_WhenPartialChristmasFlag()
    {
        // Week containing Dec 24, 2024 (Mon Dec 23 - Fri Dec 27)
        var org = CreateOrgWithPartialChristmas();
        var department = new Department
        {
            Id = "barteby", Name = "Barteby", Hotkey = 1, Organization = org,
            Consultants = Substitute.For<List<Consultant>>()
        };
        var consultant = new Consultant
        {
            Id = 1, Name = "Test", Email = "t@v.no", GraduationYear = 2010, Department = department
        };
        // Dec 23, 2024 is a Monday (week containing Dec 24)
        var week = Week.FromDateOnly(new DateOnly(2024, 12, 23));
        var bookingModel = ReadModelFactory.MapToReadModelList(consultant, [week]).Bookings[0].BookingModel;

        // Dec 24 is holiday (also public holiday in Norway), Dec 25 is public holiday — total 2 holiday days
        Assert.True(bookingModel.TotalHolidayHours >= 7.5); // at least Dec 24
    }

    [Fact]
    public void WeekWithNewYearsEve_HasOneExtraHoliday_WhenPartialChristmasFlag()
    {
        // Week Dec 30 - Jan 3, 2025 (Mon Dec 30, 2024)
        var org = CreateOrgWithPartialChristmas();
        var department = new Department
        {
            Id = "barteby", Name = "Barteby", Hotkey = 1, Organization = org,
            Consultants = Substitute.For<List<Consultant>>()
        };
        var consultant = new Consultant
        {
            Id = 1, Name = "Test", Email = "t@v.no", GraduationYear = 2010, Department = department
        };
        // Dec 30, 2024 is a Monday; Dec 31 (Tuesday) should be a holiday
        var week = Week.FromDateOnly(new DateOnly(2024, 12, 30));
        var bookingModel = ReadModelFactory.MapToReadModelList(consultant, [week]).Bookings[0].BookingModel;

        // Dec 31 is holiday, Jan 1 is also public holiday — total 2 holiday days
        Assert.Equal(2 * 7.5, bookingModel.TotalHolidayHours);
    }

    [Fact]
    public void WeekDec26To30_NoHolidays_WhenPartialChristmasFlag()
    {
        // Week Dec 26 - Dec 30, 2022 — under full Christmas this would be 5 holidays
        var org = CreateOrgWithPartialChristmas();
        var department = new Department
        {
            Id = "barteby", Name = "Barteby", Hotkey = 1, Organization = org,
            Consultants = Substitute.For<List<Consultant>>()
        };
        var consultant = new Consultant
        {
            Id = 1, Name = "Test", Email = "t@v.no", GraduationYear = 2010, Department = department
        };
        var week = Week.FromDateOnly(new DateOnly(2022, 12, 26));
        var bookingModel = ReadModelFactory.MapToReadModelList(consultant, [week]).Bookings[0].BookingModel;

        // Dec 26-30 are not holidays under partial Christmas rule
        Assert.Equal(0, bookingModel.TotalHolidayHours);
    }
}
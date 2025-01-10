import {
  BookingType,
  CompetenceReadModel,
  ConsultantReadModel,
  Degree,
  DepartmentReadModel,
  EngagementPerCustomerReadModel,
  Forecast,
  OrganisationReadModel,
  WeeklyBookingReadModel,
} from "@/api-types";

const MockWeeklyBookingReadModel: WeeklyBookingReadModel = {
  totalHolidayHours: 0,
  totalOverbooking: 0,
  totalPlannedAbsences: 0,
  totalSellableTime: 0,
  totalBillable: 0,
  totalOffered: 0,
  totalVacationHours: 0,
  totalExcludableAbsence: 0,
  totalNotStartedOrQuit: 0,
};
const mockForecast1: Forecast = {
  id: 1,
  month: 0,
  year: 2025,
  forecastValue: 80,
  hasBeenChanged: false,
  valueAddedManually: 0,
};
const mockForecast2: Forecast = {
  id: 2,
  month: 1,
  year: 2025,
  forecastValue: 80,
  hasBeenChanged: false,
  valueAddedManually: 0,
};
const mockForecast3: Forecast = {
  id: 3,
  month: 2,
  year: 2025,
  forecastValue: 50,
  hasBeenChanged: false,
  valueAddedManually: 0,
};
const mockForecast4: Forecast = {
  id: 4,
  month: 3,
  year: 2025,
  forecastValue: 100,
  hasBeenChanged: false,
  valueAddedManually: 0,
};
const mockForecast5: Forecast = {
  id: 5,
  month: 4,
  year: 2025,
  forecastValue: 0,
  hasBeenChanged: true,
  valueAddedManually: 50,
};
const mockForecast6: Forecast = {
  id: 6,
  month: 5,
  year: 2025,
  forecastValue: 70,
  hasBeenChanged: true,
  valueAddedManually: 10,
};

export const MockConsultants: ConsultantReadModel[] = [
  {
    id: 1,
    name: "Test Consultant",
    email: "test@company.io",
    competences: [{ id: "development", name: "Utvikling" }],
    department: { id: "mydepartment", name: "My Department" },
    bookings: [
      {
        year: 2023,
        weekNumber: 10,
        dateString: "",
        bookingModel: MockWeeklyBookingReadModel,
        sortableWeek: 202310,
      },
    ],
    yearsOfExperience: 23,
    detailedBooking: [],
    isOccupied: true,
    graduationYear: 2010,
    degree: Degree.Bachelor,
    forecasts: [
      mockForecast1,
      mockForecast2,
      mockForecast3,
      mockForecast4,
      mockForecast5,
      mockForecast6,
    ],
  },
  {
    id: 2,
    name: "2test Consultant",
    email: "test2@company.io",
    competences: [{ id: "development", name: "Utvikling" }],
    department: { id: "mydepartment", name: "My Department" },
    bookings: [
      {
        year: 2025,
        weekNumber: 3,
        sortableWeek: 202503,
        dateString: "13.01 - 17.01",
        bookingModel: {
          totalBillable: 0,
          totalOffered: 7.5,
          totalPlannedAbsences: 0,
          totalExcludableAbsence: 0,
          totalSellableTime: 7.5,
          totalHolidayHours: 0,
          totalVacationHours: 0,
          totalOverbooking: 0,
          totalNotStartedOrQuit: 0,
        },
      },
      {
        year: 2025,
        weekNumber: 4,
        sortableWeek: 202504,
        dateString: "20.01 - 24.01",
        bookingModel: {
          totalBillable: 20,
          totalOffered: 0,
          totalPlannedAbsences: 0,
          totalExcludableAbsence: 0,
          totalSellableTime: 0,
          totalHolidayHours: 0,
          totalVacationHours: 0,
          totalOverbooking: 0,
          totalNotStartedOrQuit: 0,
        },
      },
      {
        year: 2025,
        weekNumber: 5,
        sortableWeek: 202505,
        dateString: "27.01 - 31.01",
        bookingModel: {
          totalBillable: 20,
          totalOffered: 0,
          totalPlannedAbsences: 0,
          totalExcludableAbsence: 0,
          totalSellableTime: 0,
          totalHolidayHours: 0,
          totalVacationHours: 0,
          totalOverbooking: 0,
          totalNotStartedOrQuit: 0,
        },
      },
      {
        year: 2025,
        weekNumber: 6,
        sortableWeek: 202506,
        dateString: "03.02 - 07.02",
        bookingModel: {
          totalBillable: 20,
          totalOffered: 0,
          totalPlannedAbsences: 0,
          totalExcludableAbsence: 0,
          totalSellableTime: 37.5,
          totalHolidayHours: 0,
          totalVacationHours: 0,
          totalOverbooking: 0,
          totalNotStartedOrQuit: 0,
        },
      },
    ],
    yearsOfExperience: 23,
    detailedBooking: [
      {
        bookingDetails: {
          projectName: "Design",
          type: BookingType.Booking,
          customerName: "Aion",
          projectId: 185,
          isBillable: true,
          endDateAgreement: null,
        },
        hours: [
          { week: 202503, hours: 10 },
          { week: 202504, hours: 5 },
          { week: 202505, hours: 15 },
          { week: 202506, hours: 37 },
        ],
      },
      {
        bookingDetails: {
          projectName: "Nye nettsider",
          type: BookingType.Booking,
          customerName: "Åkerblå",
          projectId: 208,
          isBillable: true,
          endDateAgreement: "2024-11-29T00:00:00",
        },
        hours: [
          { week: 202503, hours: 10 },
          { week: 202504, hours: 5 },
          { week: 202505, hours: 15 },
          { week: 202506, hours: 37 },
          { week: 202507, hours: 37 },
          { week: 202514, hours: 37 },
        ],
      },
    ],
    isOccupied: true,
    graduationYear: 2010,
    degree: Degree.Bachelor,
    forecasts: [
      mockForecast1,
      mockForecast2,
      mockForecast3,
      mockForecast4,
      mockForecast5,
      mockForecast6,
    ],
  },
];

export const MockDepartments: DepartmentReadModel[] = [
  {
    id: "myDepartment",
    name: "My Department",
  },
];

export const MockOrganisations: OrganisationReadModel[] = [
  {
    name: "My Organisation",
    urlKey: "my-org",
  },
];

export const MockEngagements: EngagementPerCustomerReadModel[] = [
  {
    customerId: 1,
    customerName: "TestCustomer",
    engagements: [],
    isActive: false,
  },
];

export const MockCompetences: CompetenceReadModel[] = [
  {
    id: "development",
    name: "Utvikling",
  },
];

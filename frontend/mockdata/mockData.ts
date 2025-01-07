import {
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

import {
  CompetenceReadModel,
  ConsultantReadModel,
  Degree,
  DepartmentReadModel,
  EngagementPerCustomerReadModel,
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
};

export const MockConsultants: ConsultantReadModel[] = [
  {
    id: 1,
    name: "Test Consultant",
    email: "test@company.io",
    competences: [{ id: "development", name: "Utvikling" }],
    department: "My Department",
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
    degree: Degree.Bachelor,
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
  },
];

export const MockCompetences: CompetenceReadModel[] = [
  {
    id: "development",
    name: "Utvikling",
  },
];

import {
  Consultant,
  Department,
  EngagementPerCustomerReadModel,
  EngagementReadModel,
  Organisation,
  WeeklyBookingReadModel,
} from "@/types";

const MockWeeklyBookingReadModel: WeeklyBookingReadModel = {
  totalHolidayHours: 0,
  totalOverbooking: 0,
  totalPlannedAbstences: 0,
  totalSellableTime: 0,
  totalBillable: 0,
  totalOffered: 0,
  totalVacationHours: 0,
};

export const MockConsultants: Consultant[] = [
  {
    id: "id",
    name: "Test Consultant",
    email: "test@company.io",
    competences: ["Frontend"],
    department: "My Department",
    bookings: [
      {
        year: 2023,
        weekNumber: 10,
        dateString: "",
        bookingModel: MockWeeklyBookingReadModel,
      },
    ],
    yearsOfExperience: 23,
    detailedBooking: [],
    isOccupied: true,
  },
];

export const MockDepartments: Department[] = [
  {
    id: "myDepartment",
    name: "My Department",
  },
];

export const MockOrganisations: Organisation[] = [
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

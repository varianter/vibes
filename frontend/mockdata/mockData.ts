import {
  Consultant,
  Department,
  Organisation,
  WeeklyBookingReadModel,
} from "@/types";

const MockWeeklyBookingReadModel: WeeklyBookingReadModel = {
  totalBillable: 0,
  totalOffered: 0,
  totalPlannedAbstences: 0,
  totalSellableTime: 0,
  totalHolidayHours: 0,
  bookings: [],
  totalOverbooking: 0,
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

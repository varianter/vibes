import { Consultant, Department, Organisation } from "@/types";

export const MockConsultants: Consultant[] = [
  {
    id: "id",
    name: "Test Consultant",
    email: "test@company.io",
    competences: ["Frontend"],
    department: "My Department",
    bookings: [{ year: 2023, weekNumber: 10, bookedHours: 10 }],
    yearsOfExperience: 23,
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

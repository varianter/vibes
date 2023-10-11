import { Variant } from "@/types";

export const MockConsultants: Variant[] = [
  {
    id: "id",
    name: "Test Consultant",
    email: "test@company.io",
    competences: ["Frontend"],
    department: "My Department",
    bookings: [{ year: 2023, weekNumber: 10, bookedHours: 10 }],
  },
];

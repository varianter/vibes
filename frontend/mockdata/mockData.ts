//@ts-ignore

import {
  Consultant,
  Department,
  Organisation,
  WeeklyBookingReadModel,
} from "@/types";

import mockData8 from "./mockCons8.json";
import mockData12 from "./mockCons12.json";
import mockData26 from "./mockCons26.json";

const MockWeeklyBookingReadModel: WeeklyBookingReadModel = {
  totalBillable: 0,
  totalOffered: 0,
  totalPlannedAbstences: 0,
  totalSellableTime: 0,
  totalHolidayHours: 0,
  totalOverbooking: 0,
  totalVacationHours: 0,
};

export const MockDepartments: Department[] = [
  {
    id: "bergen",
    name: "Bergen",
    hotkey: 3,
  },
  {
    id: "oslo",
    name: "Oslo",
    hotkey: 2,
  },
  {
    id: "trondheim",
    name: "Trondheim",
    hotkey: 1,
  },
];

export const MockOrganisations: Organisation[] = [
  {
    name: "Variant AS",
    urlKey: "variant-norge",
  },
  {
    name: "Variant AB",
    urlKey: "variant-sverige",
  },
];

//@ts-ignore
export const MockConsultants8: Consultant[] = mockData8 as Consultant[];

//@ts-ignore
export const MockConsultants12: Consultant[] = mockData12 as Consultant[];

//@ts-ignore
export const MockConsultants26: Consultant[] = mockData26 as Consultant[];

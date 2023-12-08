import { BookingType, ProjectState } from "@/api-types";

export type YearRange = {
  label: string;
  urlString: string;
  start: number;
  end?: number;
};

export type Week = {
  year: number;
  weekNumber: number;
};

export interface updateBookingHoursBody {
  hours: number;
  bookingType: BookingType;
  consultantId: string;
  bookingId: string;
  startWeek: number;
  endWeek?: number;
}

export interface ProjectWithCustomerModel {
  projectName: string;
  customerName: string;
  projectState: ProjectState;
  isBillable: boolean;
}

export interface EngagementWriteModel {
  projectState?: ProjectState;
  isBillable?: boolean;
  projectName?: string;
  customerName?: string;
}

export interface updateProjectStateBody {
  engagementId: string;
  projectState: ProjectState;
  isBillable: boolean;
  startWeek: number;
  startYear: number;
  weekSpan: number;
}

import { BookingType, ConsultantReadModel, EngagementState } from "@/api-types";

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
  projectId: string;
  startWeek: number;
  endWeek?: number;
}

export interface updateProjectStateBody {
  engagementId: string;
  projectState: EngagementState;
  isBillable: boolean;
  startWeek: number;
  startYear: number;
  weekSpan: number;
}

export interface updateProjectNameBody {
  engagementId: string;
  engagementName: string;
}

export interface WeekWithHours {
  week: number;
  hours: number;
}

export interface ConsultantWithWeekHours {
  consultant: ConsultantReadModel;
  weekWithHours: WeekWithHours[];
}

import { BookingType } from "@/api-types";

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

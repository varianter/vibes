export interface BookedHoursPerWeek {
  year: number;
  weekNumber: number;
  bookingModel: WeeklyBookingReadModel;
  dateString: string;
}

export interface WeeklyBookingReadModel {
  /** @format double */
  totalBillable: number;
  /** @format double */
  totalOffered: number;
  /** @format double */
  totalPlannedAbstences: number;
  /** @format double */
  totalSellableTime: number;
  /** @format double */
  totalHolidayHours: number;
  /** @format double */
  totalVacationHours: number;
  /** @format double */
  totalOverbooking: number;
}

export interface BookingReadModel {
  name: string | null;
  hours: number;
  type: BookingType;
}

export enum BookingType {
  Offer = "Offer",
  Booking = "Booking",
  PlannedAbsence = "PlannedAbsence",
  Vacation = "Vacation",
}

export type Consultant = {
  id: string;
  name: string;
  email: string;
  competences: string[];
  department: string;
  yearsOfExperience: number;
  isOccupied: Boolean;
  bookings: BookedHoursPerWeek[];
  detailedBooking: DetailedBooking[];
};

export interface DetailedBooking {
  bookingDetails: BookingDetails;
  hours: WeeklyHours[];
}

export interface WeeklyHours {
  /** @format int32 */
  week: number;
  /** @format double */
  hours: number;
}

export interface BookingDetails {
  name: string | null;
  type: BookingType;
}

export type Department = {
  id: string;
  name: string;
  hotkey?: number;
};

export type Organisation = {
  name: string;
  urlKey: string;
};

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

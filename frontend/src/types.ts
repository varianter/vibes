export interface BookedHoursPerWeek {
  year: number;
  weekNumber: number;
  bookingModel: WeeklyBookingReadModel;
  dateString: string;
}

export interface WeeklyBookingReadModel {
  totalBillable: number;
  totalOffered: number;
  totalPlannedAbstences: number;
  totalSellableTime: number;
  totalHolidayHours: number;
  totalOverbooking: number;
  totalVacationHours: number;
  bookings: BookingReadModel[] | null;
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
  bookings?: BookedHoursPerWeek[] | null;
};

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

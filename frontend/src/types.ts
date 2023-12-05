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
  Available = "Available",
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
  projectName: string | null;
  type: BookingType;
  customerName: string | null;
  projectId: string;
}

export interface StaffingWriteModel {
  type: string;
  /** @format int32 */
  consultantId: number;
  /** @format int32 */
  engagementId: number;
  /** @format int32 */
  startYear: number;
  /** @format int32 */
  startWeek: number;
  /** @format int32 */
  endYear?: number;
  /** @format int32 */
  endWeek?: number;
  /** @format double */
  hours: number;
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

export enum Degree {
  Master = "Master",
  Bachelor = "Bachelor",
  None = "None",
}

export interface updateBookingHoursBody {
  hours: number;
  bookingType: BookingType;
  consultantId: string;
  bookingId: string;
  startWeek: number;
  endWeek?: number;
}

export interface ProjectWithConsultantsReadModel {
  projectName?: string | null;
  customerName?: string | null;
  bookingType?: ProjectState;
  consultants?: ConsultantReadModel[] | null;
  isBillable?: boolean;
}

export interface EngagementWriteModel {
  consultantIds?: number[] | null;
  bookingType?: ProjectState;
  isBillable?: boolean;
  projectName?: string | null;
  customerName?: string | null;
}

export enum ProjectState {
  Closed = "Closed",
  Order = "Order",
  Lost = "Lost",
  Offer = "Offer",
  Active = "Active",
}

export interface ConsultantReadModel {
  /** @format int32 */
  id?: number;
  name?: string | null;
  email?: string | null;
  competences?: string[] | null;
  department?: string | null;
  /** @format int32 */
  yearsOfExperience?: number;
  degree?: Degree;
  bookings?: BookedHoursPerWeek[] | null;
  detailedBooking?: DetailedBooking[] | null;
  isOccupied?: boolean;
}

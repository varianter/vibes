/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface BookedHoursPerWeek {
  /** @format int32 */
  year: number;
  /** @format int32 */
  weekNumber: number;
  /** @format int32 */
  sortableWeek: number;
  /** @minLength 1 */
  dateString: string;
  bookingModel: BookingReadModel;
}
export interface BookingDetails {
  /** @minLength 1 */
  projectName: string;
  type: BookingType;
  /** @minLength 1 */
  customerName: string;
  /** @format int32 */
  projectId: number;
  isBillable: boolean;
  endDateAgreement?: string | null;
}

export enum BookingType {
  Offer = "Offer",
  Booking = "Booking",
  PlannedAbsence = "PlannedAbsence",
  Vacation = "Vacation",
  Available = "Available",
  NotStartedOrQuit = "NotStartedOrQuit",
}

export interface ConsultantReadModel {
  /** @format int32 */
  id: number;
  /** @minLength 1 */
  name: string;
  /** @minLength 1 */
  email: string;
  startDate?: Date;
  endDate?: Date;
  competences: Competence[];
  discipline?: DisciplineReadModel;
  /** @minLength 1 */
  department: DepartmentReadModel;
  /** @format int32 */
  yearsOfExperience: number;
  graduationYear: number;
  degree: Degree;
  /** @format int32 */
  estimatedHourPrice: number;
  bookings: BookedHoursPerWeek[];
  detailedBooking: DetailedBooking[];
  isOccupied: boolean;
  imageUrl?: string;
  imageThumbUrl?: string;
}

export interface ConsultantWriteModel {
  /** @minLength 1 */
  name: string;
  /** @minLength 1 */
  email: string;
  /** @format int32 */
  department: DepartmentReadModel;
  competences: Competence[];
  degree: Degree;
  /** @format int32 */
  graduationYear: number;
  /** @format int32 */
  estimatedHourPrice: number;
  startDate: Date;
  endDate?: Date;
}

export type EmployeeItemChewbacca = {
  name: string;
  email: string;
  telephone: string | null;
  imageUrl: string;
  imageThumbUrl: string;
  officeName: string;
};

export type Competence = {
  /** @minLength 1 */
  id: string;
  /** @minLength 1 */
  name: string;
};

export enum Degree {
  Master,
  Bachelor,
  None,
}

export interface DepartmentReadModel {
  /** @minLength 1 */
  id: string;
  /** @minLength 1 */
  name: string;
  /** @format int32 */
  hotkey?: number | null;
}

export interface CompetenceReadModel {
  /** @minLength 1 */
  id: string;
  /** @minLength 1 */
  name: string;
}

export interface DisciplineReadModel {
  /** @minLength 1 */
  id: string;
  /** @minLength 1 */
  name: string;
}

export interface DetailedBooking {
  bookingDetails: BookingDetails;
  hours: WeeklyHours[];
}

export interface EngagementPerCustomerReadModel {
  /** @format int32 */
  customerId: number;
  /** @minLength 1 */
  customerName: string;
  engagements: EngagementReadModel[];
  isActive: boolean;
}

export interface EngagementReadModel {
  /** @format int32 */
  engagementId: number;
  /** @minLength 1 */
  engagementName: string;
  bookingType: EngagementState;
  isBillable: boolean;
}

export enum EngagementState {
  Closed = "Closed",
  Order = "Order",
  Lost = "Lost",
  Offer = "Offer",
  Absence = "Absence",
  Active = "Active",
}

export interface EngagementWriteModel {
  bookingType?: EngagementState;
  isBillable?: boolean;
  projectName?: string;
  customerName?: string;
}

export interface OrganisationReadModel {
  /** @minLength 1 */
  name: string;
  /** @minLength 1 */
  urlKey: string;
  /** @format double */
  hoursPerWorkday: number;
  /** @format double */
  hoursPerWeek: number;
}

export interface ProjectWithCustomerModel {
  /** @minLength 1 */
  projectName: string;
  /** @minLength 1 */
  customerName: string;
  bookingType: EngagementState;
  isBillable: boolean;
  /** @format int32 */
  projectId: number;
}

export interface SeveralStaffingWriteModel {
  type?: BookingType;
  /** @format int32 */
  consultantId?: number;
  /** @format int32 */
  engagementId?: number;
  /** @format int32 */
  startYear?: number;
  /** @format int32 */
  startWeek?: number;
  /** @format int32 */
  endYear?: number;
  /** @format int32 */
  endWeek?: number;
  /** @format double */
  hours?: number;
}

export interface SingleConsultantReadModel {
  /** @format int32 */
  id: number;
  /** @minLength 1 */
  name: string;
  /** @minLength 1 */
  email: string;
  /** @format date */
  startDate: string;
  /** @format date */
  endDate: string;
  competences: CompetenceReadModel[];
  discipline?: DisciplineReadModel;
  department: DepartmentReadModel;
  /** @format int32 */
  graduationYear: number;
  /** @format int32 */
  yearsOfExperience: number;
  /** @format int32 */
  estimatedHourPrice: number;
  degree: Degree;
  imageUrl?: string;
  imageThumbUrl?: string;
}

export interface StaffingWriteModel {
  type?: BookingType;
  /** @format int32 */
  consultantId?: number;
  /** @format int32 */
  engagementId?: number;
  /** @format int32 */
  startYear?: number;
  /** @format int32 */
  startWeek?: number;
  /** @format double */
  hours?: number;
}

export interface UpdateProjectWriteModel {
  /** @format int32 */
  engagementId?: number;
  projectState?: EngagementState;
  /** @format int32 */
  startYear?: number;
  /** @format int32 */
  startWeek?: number;
  /** @format int32 */
  weekSpan?: number;
}

export interface UpdateEngagementNameWriteModel {
  /** @format int32 */
  engagementId?: number;
  /** @minLength 1 */
  engagementName: string;
}

export interface VacationMetaData {
  /** @format int32 */
  daysTotal?: number;
  /** @format int32 */
  transferredDays?: number;
  /** @format int32 */
  planned?: number;
  /** @format int32 */
  used?: number;
  /** @format int32 */
  leftToPlan?: number;
}

export interface VacationReadModel {
  /** @format int32 */
  consultantId?: number;
  vacationDays?: string[];
  vacationMetaData?: VacationMetaData;
}

export interface BookingReadModel {
  /** @format double */
  totalBillable: number;
  /** @format double */
  totalOffered: number;
  /** @format double */
  totalPlannedAbsences: number;
  /** @format double */
  totalSellableTime: number;
  /** @format double */
  totalHolidayHours: number;
  /** @format double */
  totalVacationHours: number;
  /** @format double */
  totalOverbooking: number;
  /** @format double */
  totalExcludableAbsence: number;
  /** @format double */
  totalNotStartedOrQuit: number;
}

export interface WeeklyHours {
  /** @format int32 */
  week: number;
  /** @format double */
  hours: number;
}

export interface CustomersWithProjectsReadModel {
  customerId: number;
  customerName: string;
  isActive: boolean;
  activeEngagements: EngagementReadModel[];
  inactiveEngagements: EngagementReadModel[];
}

export interface ConsultantWithForecast {
  consultant: SingleConsultantReadModel;
  bookings: BookedHoursInMonth[];
  detailedBookings: DetailedBookingForMonth[];
  forecasts: ForecastForMonth[];
  consultantIsAvailable: boolean;
}

export interface BookedHoursInMonth {
  /** @format date */
  month: string;
  bookingModel: BookingReadModel;
}

export interface DetailedBookingForMonth {
  bookingDetails: BookingDetails;
  hours: MonthlyHours[];
}

export interface MonthlyHours {
  /** @format date */
  month: string;
  /** @format double */
  hours: number;
}

export interface ForecastForMonth {
  /** @format date */
  month: string;
  /** @format double */
  billableHours: number;
  /** @format double */
  salariedHours: number;
  /** @format int32 */
  billablePercentage: number;
  /** @format int32 */
  displayedPercentage: number;
}

export interface Forecast {
  /** @format int32 */
  consultantId: number;
  /** @format date */
  month: string;
  /** @format int32 */
  adjustedValue: number;
}

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
  bookingModel: WeeklyBookingReadModel;
}

export interface BookingDetails {
  /** @minLength 1 */
  projectName: string;
  type: BookingType;
  /** @minLength 1 */
  customerName: string;
  /** @format int32 */
  projectId: number;
}

export enum BookingType {
  Offer = "Offer",
  Booking = "Booking",
  PlannedAbsence = "PlannedAbsence",
  Vacation = "Vacation",
  Available = "Available",
}

export interface ConsultantReadModel {
  /** @format int32 */
  id: number;
  /** @minLength 1 */
  name: string;
  /** @minLength 1 */
  email: string;
  competences: string[];
  /** @minLength 1 */
  department: string;
  /** @format int32 */
  yearsOfExperience: number;
  degree: Degree;
  bookings: BookedHoursPerWeek[];
  detailedBooking: DetailedBooking[];
  isOccupied: boolean;
}

export enum Degree {
  Master = "Master",
  Bachelor = "Bachelor",
  None = "None",
}

export interface DepartmentReadModel {
  /** @minLength 1 */
  id: string;
  /** @minLength 1 */
  name: string;
  /** @format int32 */
  hotkey?: number | null;
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
}

export interface EngagementReadModel {
  /** @format int32 */
  engagementId: number;
  /** @minLength 1 */
  engagementName: string;
  bookingType: ProjectState;
  isBillable: boolean;
}

export interface EngagementWriteModel {
  consultantIds?: number[];
  bookingType?: ProjectState;
  isBillable?: boolean;
  projectName?: string;
  customerName?: string;
}

export interface OrganisationReadModel {
  /** @minLength 1 */
  name: string;
  /** @minLength 1 */
  urlKey: string;
}

export enum ProjectState {
  Closed = "Closed",
  Order = "Order",
  Lost = "Lost",
  Offer = "Offer",
  Active = "Active",
}

export interface ProjectWithCustomerModel {
  /** @minLength 1 */
  projectName: string;
  /** @minLength 1 */
  customerName: string;
  bookingType: ProjectState;
  isBillable: boolean;
}

export interface SeveralStaffingWriteModel {
  type: BookingType;
  /** @format int32 */
  consultantId: number;
  /** @format int32 */
  engagementId: number;
  /** @format int32 */
  startYear: number;
  /** @format int32 */
  startWeek: number;
  /** @format int32 */
  endYear: number;
  /** @format int32 */
  endWeek: number;
  /** @format double */
  hours: number;
}

export interface StaffingWriteModel {
  type: BookingType;
  /** @format int32 */
  consultantId: number;
  /** @format int32 */
  engagementId: number;
  /** @format int32 */
  startYear: number;
  /** @format int32 */
  startWeek: number;
  /** @format double */
  hours: number;
}

export interface WeeklyBookingReadModel {
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
}

export interface WeeklyHours {
  /** @format int32 */
  week: number;
  /** @format double */
  hours: number;
}

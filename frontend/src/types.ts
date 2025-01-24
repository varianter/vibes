import {
  BookingDetails,
  BookingType,
  Competence,
  ConsultantReadModel,
  Degree,
  DepartmentReadModel,
  EngagementState,
  BookingReadModel,
} from "@/api-types";

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
export interface ConsultantForecastReadModel {
  id: number;
  name: string;
  competences: Competence[];
  department: DepartmentReadModel;
  yearsOfExperience: number;
  graduationYear: number;
  degree: Degree;
  bookings: BookedHoursPerMonth[]; // <-- Endret
  detailedBooking: MonthlyDetailedBooking[]; // <-- Endret
  forecasts?: Forecast[]; // <-- Lagt til
  isOccupied: boolean;
  imageThumbUrl?: string; // populeres i frontend med data fra Chewbacca
}

export interface updateBookingHoursBody {
  hours: number;
  bookingType: BookingType;
  consultantId: string;
  projectId: string;
  startWeek: number;
  endWeek?: number;
}

export interface Month {
  month: number;
  year: number;
}
export interface BookedHoursPerMonth {
  month: number;
  year: number;
  bookingModel: BookingReadModel;
}

export interface Forecast {
  id: number;
  month: number;
  year: number;
  forecastValue: number;
  hasBeenChanged: boolean;
  valueAddedManually: number;
}

export interface MonthlyDetailedBooking {
  bookingDetails: BookingDetails;
  hours: MonthlyHours[];
}
export interface MonthlyHours {
  month: number;
  hours: number;
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

export interface Agreement {
  name: string;
  agreementId: number;
  customerId?: number;
  engagementId?: number;
  startDate?: Date;
  endDate: Date;
  nextPriceAdjustmentDate?: Date;
  priceAdjustmentIndex?: string;
  notes?: string;
  options?: string;
  priceAdjustmentProcess?: string;
  files?: FileReference[];
}

export interface AgreementWriteModel {
  name: string;
  customerId?: number;
  engagementId?: number;
  startDate?: Date;
  endDate: Date;
  nextPriceAdjustmentDate?: Date;
  priceAdjustmentIndex?: string;
  notes?: string;
  options?: string;
  priceAdjustmentProcess?: string;
  files?: FileReference[];
}

export interface FileReference {
  fileName: string;
  blobName: string;
  uploadedOn: Date;
  uploadedBy?: string;
}

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

// Draft returned by the backend after extracting values from an uploaded document (beta)
export interface ConsultantDocumentDraft {
  name: string;
  departmentId: string | null;
  degree: "Master" | "Bachelor" | "None";
  graduationYear: number | null;
  startDate: string | null;
}

// Automated onboarding (beta), see backend Api/Onboardings
export type OnboardingStepType =
  | "EntraId"
  | "Slack"
  | "Flowcase"
  | "Staffing"
  | "Donut";

export type OnboardingStepStatus =
  | "NotStarted"
  | "InProgress"
  | "Done"
  | "Failed";

export interface OnboardingStepReadModel {
  type: OnboardingStepType;
  order: number;
  status: OnboardingStepStatus;
  updatedAt: string;
  message?: string | null;
  // Steps that must be done before this one can start
  dependsOn: OnboardingStepType[];
}

export interface ActiveOnboardingReadModel {
  id: number;
  consultantId: number;
  // Status of each step, in step order
  stepStatuses: OnboardingStepStatus[];
}

export interface OnboardingReadModel {
  id: number;
  consultantId: number;
  consultantName: string;
  createdAt: string;
  steps: OnboardingStepReadModel[];
}

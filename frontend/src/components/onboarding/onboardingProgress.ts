import { OnboardingStepStatus } from "@/types";

export interface OnboardingProgress {
  doneCount: number;
  totalCount: number;
  failedCount: number;
  label: string;
}

export function onboardingProgress(
  stepStatuses: OnboardingStepStatus[],
): OnboardingProgress {
  const doneCount = stepStatuses.filter((s) => s === "Done").length;
  const failedCount = stepStatuses.filter((s) => s === "Failed").length;
  const totalCount = stepStatuses.length;

  return {
    doneCount,
    totalCount,
    failedCount,
    label:
      failedCount > 0
        ? `${failedCount} steg feilet`
        : `Onboarding ${doneCount}/${totalCount}`,
  };
}

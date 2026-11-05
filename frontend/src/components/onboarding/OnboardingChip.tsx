import { ActiveOnboardingReadModel, OnboardingStepStatus } from "@/types";
import Link from "next/link";
import { ChevronRight } from "react-feather";
import { onboardingProgress } from "./onboardingProgress";

const segmentColors: Record<OnboardingStepStatus, string> = {
  NotStarted: "bg-primary/20",
  InProgress: "bg-primary/50",
  Done: "bg-activate",
  Failed: "bg-error",
};

// Shows that a consultant is being onboarded (beta) and links to the status page
export default function OnboardingChip({
  onboarding,
  organisation,
  consultantName,
}: {
  onboarding: ActiveOnboardingReadModel;
  organisation: string;
  consultantName: string;
}) {
  const progress = onboardingProgress(onboarding.stepStatuses);
  const hasFailed = progress.failedCount > 0;

  return (
    <Link
      href={`/${organisation}/konsulenter/onboarding/${onboarding.id}`}
      onClick={(e) => e.stopPropagation()}
      aria-label={`Se onboarding-status for ${consultantName}: ${progress.label}`}
      title="Se onboarding-status"
      className={`flex flex-row items-center gap-1.5 rounded-full border bg-white py-0.5 pl-1.5 pr-1 xsmall whitespace-nowrap hover:bg-background_grey focus:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
        hasFailed ? "border-error text-error" : "border-primary/20 text-primary"
      }`}
    >
      <span className="flex flex-row gap-0.5" aria-hidden="true">
        {onboarding.stepStatuses.map((status, index) => (
          <span
            key={index}
            className={`block h-1.5 w-1.5 rounded-sm ${segmentColors[status]}`}
          />
        ))}
      </span>
      {progress.label}
      <ChevronRight size={12} aria-hidden="true" />
    </Link>
  );
}

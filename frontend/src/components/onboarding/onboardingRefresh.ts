import { OnboardingReadModel, OnboardingStepType } from "@/types";
import { stepState } from "./onboardingSteps";

// Steps run by a background job in the backend
const automatedSteps: OnboardingStepType[] = ["EntraId", "Flowcase"];

// Automated steps are picked up within seconds; stop waiting after this
const maxWaitForStartMs = 2 * 60 * 1000;

// True while a step is running, or an automated step has its dependencies done and is about to start
export function shouldAutoRefresh(
  onboarding: OnboardingReadModel,
  now: Date = new Date(),
): boolean {
  const steps = onboarding.steps;
  if (steps.some((step) => step.status === "InProgress")) {
    return true;
  }

  const readyToStart = steps.some(
    (step) =>
      automatedSteps.includes(step.type) &&
      step.status === "NotStarted" &&
      stepState(step, steps).kind === "status",
  );

  const lastChange = Math.max(
    new Date(onboarding.createdAt).getTime(),
    ...steps.map((step) => new Date(step.updatedAt).getTime()),
  );
  return readyToStart && now.getTime() - lastChange < maxWaitForStartMs;
}

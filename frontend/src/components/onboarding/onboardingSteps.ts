import { OnboardingStepReadModel, OnboardingStepType } from "@/types";

export const stepLabels: Record<
  OnboardingStepType,
  { name: string; system: string }
> = {
  EntraId: { name: "Bruker og lisens", system: "Entra ID / O365" },
  Slack: { name: "Slack-konto", system: "Slack" },
  Flowcase: { name: "CV-profil", system: "Flowcase" },
  Staffing: { name: "Registrert i bemanning", system: "Vibes" },
  Donut: { name: "Onboarding-meldinger", system: "Donut" },
};

// How a step is shown: its stored status, or, for a step that has not started,
// what it is waiting for (dependsOn from the backend)
export type StepState =
  | { kind: "status" }
  | { kind: "waiting"; on: OnboardingStepType[] }
  | { kind: "blocked"; on: OnboardingStepType[] };

export function stepState(
  step: OnboardingStepReadModel,
  steps: OnboardingStepReadModel[],
): StepState {
  if (step.status !== "NotStarted") return { kind: "status" };

  const dependencies = step.dependsOn
    .map((type) => steps.find((other) => other.type === type))
    .filter((other): other is OnboardingStepReadModel => !!other);

  // Blocked when a dependency failed or is blocked itself, e.g. Donut after Slack after a failed Entra step
  const blockedBy = dependencies.filter(
    (other) =>
      other.status === "Failed" || stepState(other, steps).kind === "blocked",
  );
  if (blockedBy.length > 0) {
    return { kind: "blocked", on: blockedBy.map((other) => other.type) };
  }

  const waitingFor = dependencies.filter((other) => other.status !== "Done");
  if (waitingFor.length > 0) {
    return { kind: "waiting", on: waitingFor.map((other) => other.type) };
  }

  return { kind: "status" };
}

// e.g. "«Bruker og lisens» og «Slack-konto»"
export function stepNames(types: OnboardingStepType[]): string {
  return types.map((type) => `«${stepLabels[type].name}»`).join(" og ");
}

import { OnboardingReadModel, OnboardingStepStatus } from "@/types";
import { AlertCircle, Check, Circle, Clock, Loader, Lock } from "react-feather";
import { StepState, stepLabels, stepNames, stepState } from "./onboardingSteps";

type BadgeStyle = { label: string; className: string; icon: JSX.Element };

const statusStyles: Record<OnboardingStepStatus, BadgeStyle> = {
  NotStarted: {
    label: "Ikke startet",
    className: "bg-background_grey text-text_light_black",
    icon: <Circle size={16} />,
  },
  InProgress: {
    label: "Pågår",
    className: "bg-available text-primary",
    icon: <Loader size={16} />,
  },
  Done: {
    label: "Fullført",
    className: "bg-activate text-white",
    icon: <Check size={16} />,
  },
  Failed: {
    label: "Feilet",
    className: "bg-error text-white",
    icon: <AlertCircle size={16} />,
  },
};

const waitingStyle: BadgeStyle = {
  label: "Venter",
  className: "bg-background_grey text-text_light_black",
  icon: <Clock size={16} />,
};

const blockedStyle: BadgeStyle = {
  label: "Blokkert",
  className: "border border-primary/20 text-text_light_black",
  icon: <Lock size={16} />,
};

function badgeFor(status: OnboardingStepStatus, state: StepState): BadgeStyle {
  if (state.kind === "waiting") return waitingStyle;
  if (state.kind === "blocked") return blockedStyle;
  return statusStyles[status];
}

function dependencyText(state: StepState): string | undefined {
  if (state.kind === "waiting") {
    return `Starter når ${stepNames(state.on)} er fullført`;
  }
  if (state.kind === "blocked") {
    return `Kan ikke starte før ${stepNames(state.on)} er fullført`;
  }
}

export default function OnboardingStatus({
  onboarding,
}: {
  onboarding: OnboardingReadModel;
}) {
  const steps = [...onboarding.steps].sort((a, b) => a.order - b.order);
  const doneCount = steps.filter((step) => step.status === "Done").length;

  return (
    <div className="flex flex-col gap-6">
      <p className="normal">
        {doneCount} av {steps.length} steg er fullført. Startet{" "}
        {new Date(onboarding.createdAt).toLocaleDateString("nb-NO")}.
      </p>
      <ol
        className="flex flex-col gap-3 max-w-2xl"
        aria-label="Onboarding-steg"
      >
        {steps.map((step) => {
          const label = stepLabels[step.type];
          const state = stepState(step, steps);
          const status = badgeFor(step.status, state);
          const waitingText = dependencyText(state);
          return (
            <li
              key={step.type}
              className="flex flex-row items-start justify-between gap-4 rounded-md border border-primary/10 p-4"
            >
              <div className="flex flex-col gap-1">
                <p className="normal-medium">
                  {step.order}. {label.name}
                </p>
                <p className="small text-text_light_black">{label.system}</p>
                {waitingText && (
                  <p className="small text-text_light_black">{waitingText}</p>
                )}
                {step.message && (
                  <p className="small text-error">{step.message}</p>
                )}
              </div>
              <span
                className={`flex flex-row items-center gap-1 rounded-full px-3 py-1 small whitespace-nowrap ${status.className}`}
              >
                {status.icon}
                {status.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

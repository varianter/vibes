import { test, expect } from "@playwright/test";
import { ConsultantDocumentDraft } from "@/types";
import { onboardingProgress } from "@/components/onboarding/onboardingProgress";
import { shouldAutoRefresh } from "@/components/onboarding/onboardingRefresh";
import { stepState } from "@/components/onboarding/onboardingSteps";
import {
  OnboardingReadModel,
  OnboardingStepReadModel,
  OnboardingStepStatus,
  OnboardingStepType,
} from "@/types";

const dependsOn: Record<OnboardingStepType, OnboardingStepType[]> = {
  Staffing: [],
  EntraId: ["Staffing"],
  Flowcase: ["EntraId"],
  Slack: ["EntraId"],
  Donut: ["Slack"],
};

function step(
  type: OnboardingStepType,
  order: number,
  status: OnboardingStepStatus,
  updatedAt: string,
): OnboardingStepReadModel {
  return { type, order, status, updatedAt, dependsOn: dependsOn[type] };
}

function onboardingWith(
  entraStatus: OnboardingStepStatus,
  createdAt: string,
  slackStatus: OnboardingStepStatus = "NotStarted",
): OnboardingReadModel {
  return {
    id: 1,
    consultantId: 1,
    consultantName: "Kari Nordmann",
    createdAt,
    steps: [
      step("Staffing", 1, "Done", createdAt),
      step("EntraId", 2, entraStatus, createdAt),
      step("Slack", 4, slackStatus, createdAt),
    ],
  };
}

test.describe("shouldAutoRefresh", () => {
  const now = new Date("2026-11-02T12:00:00Z");

  test("refreshes while a step is in progress", () => {
    expect(
      shouldAutoRefresh(
        onboardingWith("InProgress", "2026-11-01T12:00:00Z"),
        now,
      ),
    ).toBe(true);
  });

  test("refreshes while a new Entra step waits to start", () => {
    expect(
      shouldAutoRefresh(
        onboardingWith("NotStarted", "2026-11-02T11:59:30Z"),
        now,
      ),
    ).toBe(true);
  });

  test("stops waiting for the Entra step after two minutes", () => {
    expect(
      shouldAutoRefresh(
        onboardingWith("NotStarted", "2026-11-02T11:57:00Z"),
        now,
      ),
    ).toBe(false);
  });

  test("does not refresh when Entra is done and the rest is not started", () => {
    expect(
      shouldAutoRefresh(onboardingWith("Done", "2026-11-02T11:59:30Z"), now),
    ).toBe(false);
  });

  test("refreshes while Flowcase waits to start after Entra is done", () => {
    const onboarding = onboardingWith("Done", "2026-11-02T11:50:00Z");
    onboarding.steps[1].updatedAt = "2026-11-02T11:59:30Z";
    onboarding.steps.push(
      step("Flowcase", 3, "NotStarted", "2026-11-02T11:50:00Z"),
    );

    expect(shouldAutoRefresh(onboarding, now)).toBe(true);
  });

  test("does not wait for Flowcase when Entra failed", () => {
    const onboarding = onboardingWith("Failed", "2026-11-02T11:59:30Z");
    onboarding.steps.push(
      step("Flowcase", 3, "NotStarted", "2026-11-02T11:59:30Z"),
    );

    expect(shouldAutoRefresh(onboarding, now)).toBe(false);
  });
});

test.describe("stepState", () => {
  const at = "2026-11-02T12:00:00Z";
  function stepsWithEntra(entraStatus: OnboardingStepStatus) {
    return [
      step("Staffing", 1, "Done", at),
      step("EntraId", 2, entraStatus, at),
      step("Flowcase", 3, "NotStarted", at),
      step("Slack", 4, "NotStarted", at),
      step("Donut", 5, "NotStarted", at),
    ];
  }
  function stateOf(steps: OnboardingStepReadModel[], type: OnboardingStepType) {
    return stepState(steps.find((s) => s.type === type)!, steps);
  }

  test("waits for dependencies that are not done", () => {
    const steps = stepsWithEntra("InProgress");

    expect(stateOf(steps, "Flowcase")).toEqual({
      kind: "waiting",
      on: ["EntraId"],
    });
    expect(stateOf(steps, "Donut")).toEqual({ kind: "waiting", on: ["Slack"] });
  });

  test("shows the stored status when dependencies are done", () => {
    const steps = stepsWithEntra("Done");

    expect(stateOf(steps, "Flowcase")).toEqual({ kind: "status" });
    expect(stateOf(steps, "Slack")).toEqual({ kind: "status" });
    expect(stateOf(steps, "EntraId")).toEqual({ kind: "status" });
  });

  test("is blocked by a failed dependency, also further down", () => {
    const steps = stepsWithEntra("Failed");

    expect(stateOf(steps, "Flowcase")).toEqual({
      kind: "blocked",
      on: ["EntraId"],
    });
    expect(stateOf(steps, "Donut")).toEqual({ kind: "blocked", on: ["Slack"] });
  });
});

test.describe("onboardingProgress", () => {
  test("shows done steps out of total while nothing has failed", () => {
    expect(
      onboardingProgress(["Done", "Done", "InProgress", "NotStarted"]),
    ).toEqual({
      doneCount: 2,
      totalCount: 4,
      failedCount: 0,
      label: "Onboarding 2/4",
    });
  });

  test("shows failed steps first", () => {
    expect(
      onboardingProgress(["Done", "Failed", "Failed", "NotStarted"]).label,
    ).toBe("2 steg feilet");
  });
});

const draft: ConsultantDocumentDraft = {
  name: "Kari Nordmann",
  departmentId: "myDepartment",
  degree: "Master",
  graduationYear: 2014,
  startDate: "2026-08-01",
};

test("beta flow starts onboarding and shows the status page", async ({
  page,
}) => {
  await page.route("**/my-org/konsulenter/api/consultant/extract", (route) =>
    route.fulfill({ json: draft }),
  );

  await page.goto("/my-org/konsulenter");
  await page
    .getByRole("button", { name: "Legg til konsulent (automatisert/beta)" })
    .click();
  await page.getByLabel("Last opp ansettelsestilbud (PDF)").setInputFiles({
    name: "tilbud.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 test"),
  });
  await page.getByRole("button", { name: "Hent verdier" }).click();

  await page.locator("#email").fill("kari.nordmann@variant.no");
  await page.getByRole("button", { name: "Start onboarding" }).click();

  // The mocked backend (NO_AUTH) answers with MockOnboarding, id 1
  await page.waitForURL("**/my-org/konsulenter/onboarding/1");
  await expect(
    page.getByRole("heading", { name: "Onboarding: Test Consultant" }),
  ).toBeVisible();
});

test("status page shows every step with its status", async ({ page }) => {
  await page.goto("/my-org/konsulenter/onboarding/1");

  const steps = page.getByRole("list", { name: "Onboarding-steg" });
  const items = steps.getByRole("listitem");

  await expect(items).toHaveCount(5);
  await expect(items.nth(0)).toContainText("1. Registrert i bemanning");
  await expect(items.nth(0)).toContainText("Fullført");
  await expect(items.nth(1)).toContainText("2. Bruker og lisens");
  await expect(items.nth(2)).toContainText("3. CV-profil");
  await expect(items.nth(2)).toContainText("Feilet");
  await expect(items.nth(2)).toContainText("Fant ikke kontoret i Flowcase");
  await expect(items.nth(3)).toContainText("4. Slack-konto");
  await expect(items.nth(3)).toContainText("Pågår");
  await expect(items.nth(4)).toContainText("5. Onboarding-meldinger");
  await expect(items.nth(4)).toContainText("Venter");
  await expect(items.nth(4)).toContainText(
    "Starter når «Slack-konto» er fullført",
  );
  await expect(page.getByText("2 av 5 steg er fullført")).toBeVisible();
});

test("consultant with onboarding in process links to its status page", async ({
  page,
}) => {
  await page.goto("/my-org/konsulenter");

  // MockActiveOnboardings: Test Consultant (id 1) has onboarding 1 in process, with one failed step
  const chip = page.getByRole("link", {
    name: "Se onboarding-status for Test Consultant",
  });
  await expect(chip).toHaveText("1 steg feilet");
  await chip.click();

  await page.waitForURL("**/my-org/konsulenter/onboarding/1");
  await expect(
    page.getByRole("heading", { name: "Onboarding: Test Consultant" }),
  ).toBeVisible();
});

test("regular add consultant form is unchanged", async ({ page }) => {
  await page.goto("/my-org/konsulenter");
  await page
    .getByRole("button", { name: "Legg til konsulent", exact: true })
    .click();

  await expect(page.getByRole("button", { name: "Lagre" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Start onboarding" }),
  ).toBeHidden();
});

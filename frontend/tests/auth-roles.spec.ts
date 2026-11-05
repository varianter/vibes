import { test, expect } from "@playwright/test";
import { hasRole, onboardingRole, withMockRoles } from "@/utils/auth";

test.describe("withMockRoles", () => {
  test("adds mock roles outside production", () => {
    expect(withMockRoles([], "Vibes.Onboarding", "development")).toEqual([
      "Vibes.Onboarding",
    ]);
  });

  test("ignores mock roles in production", () => {
    expect(
      withMockRoles(["Vibes.Use"], "Vibes.Onboarding", "production"),
    ).toEqual(["Vibes.Use"]);
  });

  test("keeps token roles and removes duplicates and blanks", () => {
    expect(
      withMockRoles(
        ["Vibes.Use"],
        " Vibes.Onboarding , Vibes.Use,,",
        "development",
      ),
    ).toEqual(["Vibes.Use", "Vibes.Onboarding"]);
  });

  test("returns token roles unchanged without mock roles", () => {
    expect(withMockRoles(["Vibes.Use"], undefined, "development")).toEqual([
      "Vibes.Use",
    ]);
  });
});

test.describe("hasRole", () => {
  test("is true only when the role is present", () => {
    expect(hasRole([onboardingRole], onboardingRole)).toBe(true);
    expect(hasRole(["Vibes.Use"], onboardingRole)).toBe(false);
    expect(hasRole(undefined, onboardingRole)).toBe(false);
  });
});

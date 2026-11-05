export const azureAdProvider = "azure-ad";
export const refreshAccessTokenError = "RefreshAccessTokenError";

// App role in Entra ID (app registration "vibes-dev") for adding consultants from documents
export const onboardingRole = "Vibes.Onboarding";

// Adds roles from MOCK_ROLES (comma separated) outside production, for testing before roles are assigned in Entra
export function withMockRoles(
  roles: string[],
  mockRoles: string | undefined = process.env.MOCK_ROLES,
  nodeEnv: string | undefined = process.env.NODE_ENV,
): string[] {
  if (!mockRoles || nodeEnv === "production") return roles;

  const extraRoles = mockRoles
    .split(",")
    .map((role) => role.trim())
    .filter((role) => role !== "");

  return Array.from(new Set([...roles, ...extraRoles]));
}

export function hasRole(roles: string[] | undefined, role: string): boolean {
  return roles?.includes(role) ?? false;
}

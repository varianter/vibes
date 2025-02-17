"use client";

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from "react";
import { OrganisationReadModel } from "@/api-types";

export type OrganizationContextType = {
  organization: string | undefined;
  setOrganization: (organization: string) => void;
  organizations: OrganisationReadModel[];
  currentOrganization: OrganisationReadModel | undefined;
};

export const OrganizationContext = createContext<OrganizationContextType>({
  organization: "",
  setOrganization: () => null,
  organizations: [],
  currentOrganization: undefined,
});

export function OrganizationContextProvider({
  organizations,
  organization,
  setOrganization,
  ...props
}: PropsWithChildren<{
  organizations: OrganisationReadModel[];
  organization: string | undefined;
  setOrganization: (organization: string) => void;
}>) {
  const currentOrganization = useMemo(
    () => organizations.find((o) => o.urlKey === organization),
    [organization, organizations],
  );
  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        organization,
        setOrganization,
        currentOrganization,
      }}
      {...props}
    />
  );
}

export function useOrganizationContext(): OrganizationContextType {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error(
      "useOrganizationContext must be used within a OrganizationContextProvider",
    );
  }
  return context;
}

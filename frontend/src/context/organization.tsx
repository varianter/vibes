"use client";

import React, { createContext, PropsWithChildren, useContext } from "react";
import { OrganisationReadModel } from "@/api-types";

export type OrganizationContextType = {
  organization: string | undefined;
  setOrganization: (organization: string) => void;
  organizations: OrganisationReadModel[];
};

export const OrganizationContext = createContext<OrganizationContextType>({
  organization: "",
  setOrganization: () => null,
  organizations: [],
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
  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        organization,
        setOrganization,
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

"use client";

import { CustomSession } from "@/app/api/auth/[...nextauth]/route";
import { createContext, PropsWithChildren, useContext } from "react";

export type SessionContextType = {
  session: CustomSession | null;
};

export const SessionContext = createContext<SessionContextType>({
  session: null,
});

export function SessionContextProvider({
  session,
  ...props
}: PropsWithChildren<{
  session: CustomSession | null;
}>) {
  return <SessionContext.Provider value={{ session }} {...props} />;
}

export function useSessionContext(): SessionContextType {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error(
      "useSessionContext must be used within a SessionContextProvider",
    );
  }
  return context;
}

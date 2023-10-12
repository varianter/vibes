import { VibesSession } from "@/auth-tools/sessionTools";
import { useSession } from "next-auth/react";

export function useVibesSession() {
  const session = useSession();

  const { update, status } = session;
  const data = session.data as Partial<VibesSession>;

  return { status, update, ...data, data };
}

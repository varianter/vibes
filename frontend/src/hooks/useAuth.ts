import {  useSession } from "next-auth/react";

export function useAuth() {
    const core = useSession();

    const { status } = core;

    return  { isAuthenticated: status === "authenticated" }
}
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Re-fetches the server component's data at an interval, e.g. while onboarding steps are running
export default function AutoRefresh({
  intervalMs = 3000,
}: {
  intervalMs?: number;
}) {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(timer);
  }, [router, intervalMs]);

  return null;
}

import {
  authOptions,
  getCustomServerSession,
} from "@/app/api/auth/[...nextauth]/route";
import AutoRefresh from "@/components/onboarding/AutoRefresh";
import OnboardingStatus from "@/components/onboarding/OnboardingStatus";
import { shouldAutoRefresh } from "@/components/onboarding/onboardingRefresh";
import { fetchWithToken } from "@/data/apiCallsWithToken";
import { OnboardingReadModel } from "@/types";
import { hasRole, onboardingRole } from "@/utils/auth";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "react-feather";

export const metadata: Metadata = {
  title: "Onboarding | VIBES",
};

export default async function OnboardingPage({
  params,
}: {
  params: { organisation: string; id: string };
}) {
  const session =
    !process.env.NEXT_PUBLIC_NO_AUTH &&
    (await getCustomServerSession(authOptions));

  const canUseOnboarding =
    !!process.env.NEXT_PUBLIC_NO_AUTH ||
    (!!session && hasRole(session.roles, onboardingRole));

  const onboarding = canUseOnboarding
    ? await fetchWithToken<OnboardingReadModel>(
        `${params.organisation}/onboardings/${encodeURIComponent(params.id)}`,
      )
    : undefined;

  return (
    <div className="main p-4 pt-5 w-full flex flex-col gap-8">
      <Link
        href={`/${params.organisation}/konsulenter`}
        className="flex flex-row items-center gap-1 small text-primary w-fit"
      >
        <ArrowLeft size={16} /> Tilbake til konsulenter
      </Link>
      {!canUseOnboarding ? (
        <p>Du har ikke tilgang til automatisert onboarding.</p>
      ) : !onboarding ? (
        <p>Fant ikke denne onboardingen.</p>
      ) : (
        <>
          <h1>Onboarding: {onboarding.consultantName}</h1>
          <OnboardingStatus onboarding={onboarding} />
          {shouldAutoRefresh(onboarding) && <AutoRefresh />}
        </>
      )}
    </div>
  );
}

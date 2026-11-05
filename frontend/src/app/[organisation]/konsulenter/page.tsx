import {
  CompetenceReadModel,
  ConsultantReadModel,
  DepartmentReadModel,
  DisciplineReadModel,
} from "@/api-types";
import {
  authOptions,
  getCustomServerSession,
} from "@/app/api/auth/[...nextauth]/route";
import ConsultantsContent from "@/components/consultants/ConsultantsContent";
import { hasRole, onboardingRole } from "@/utils/auth";
import { ActiveOnboardingReadModel } from "@/types";
import {
  fetchEmployeesWithImageAndToken,
  fetchWithToken,
} from "@/data/apiCallsWithToken";
import { ConsultantFilterProvider } from "@/hooks/ConsultantFilterProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Konsulenter | VIBES",
};

export default async function Konsulenter({
  params,
}: {
  params: { organisation: string };
}) {
  const session =
    !process.env.NEXT_PUBLIC_NO_AUTH &&
    (await getCustomServerSession(authOptions));

  const canUseOnboarding =
    !!process.env.NEXT_PUBLIC_NO_AUTH ||
    (!!session && hasRole(session.roles, onboardingRole));

  const [consultants, departments, competences, disciplines, onboardings] =
    await Promise.all([
      fetchEmployeesWithImageAndToken(`${params.organisation}/consultants`),
      fetchWithToken<DepartmentReadModel[]>(
        `organisations/${params.organisation}/departments`,
      ),
      fetchWithToken<CompetenceReadModel[]>(`competences`),
      fetchWithToken<DisciplineReadModel[]>(`disciplines`),
      canUseOnboarding
        ? fetchWithToken<ActiveOnboardingReadModel[]>(
            `${params.organisation}/onboardings`,
          )
        : undefined,
    ]);

  // Consultant id -> onboarding in process
  const activeOnboardings = Object.fromEntries(
    (onboardings ?? []).map((onboarding) => [
      onboarding.consultantId,
      onboarding,
    ]),
  );

  return (
    <ConsultantFilterProvider
      consultants={consultants ?? []}
      departments={departments ?? []}
      competences={competences ?? []}
      disciplines={disciplines ?? []}
      customers={[]}
    >
      <ConsultantsContent
        canUseOnboarding={canUseOnboarding}
        activeOnboardings={activeOnboardings}
      />
    </ConsultantFilterProvider>
  );
}

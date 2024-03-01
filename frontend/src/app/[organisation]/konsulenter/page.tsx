import {
  CompetenceReadModel,
  ConsultantReadModel,
  DepartmentReadModel,
  EmployeeItemChewbacca,
} from "@/api-types";
import ConsultantsContent from "@/components/consultants/ConsultantsContent";
import {
  fetchEmployeesWithImageAndToken,
  fetchWithToken,
} from "@/data/apiCallsWithToken";
import { ConsultantFilterProvider } from "@/hooks/ConsultantFilterProvider";

export default async function Konsulenter({
  params,
}: {
  params: { organisation: string };
}) {
  const consultants: ConsultantReadModel[] =
    (await fetchEmployeesWithImageAndToken(
      `${params.organisation}/consultants`,
    )) ?? [];

  const departments =
    (await fetchWithToken<DepartmentReadModel[]>(
      `organisations/${params.organisation}/departments`,
    )) ?? [];

  const comptences =
    (await fetchWithToken<CompetenceReadModel[]>(`competences`)) ?? [];

  return (
    <ConsultantFilterProvider
      consultants={consultants}
      departments={departments}
      competences={comptences}
      customers={[]}
    >
      <ConsultantsContent />
    </ConsultantFilterProvider>
  );
}

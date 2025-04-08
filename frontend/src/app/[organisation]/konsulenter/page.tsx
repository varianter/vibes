import {
  CompetenceReadModel,
  ConsultantReadModel,
  DepartmentReadModel,
  DisciplineReadModel,
} from "@/api-types";
import ConsultantsContent from "@/components/consultants/ConsultantsContent";
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
  const [consultants, departments, competences, disciplines] = await Promise.all([
    fetchEmployeesWithImageAndToken(`${params.organisation}/consultants`),
    fetchWithToken<DepartmentReadModel[]>(
      `organisations/${params.organisation}/departments`,
    ),
    fetchWithToken<CompetenceReadModel[]>(`competences`),
    fetchWithToken<DisciplineReadModel[]>(`disciplines`),
  ]);

  return (
    <ConsultantFilterProvider
      consultants={consultants ?? []}
      departments={departments ?? []}
      competences={competences ?? []}
      disciplines={disciplines ?? []}
      customers={[]}
    >
      <ConsultantsContent />
    </ConsultantFilterProvider>
  );
}

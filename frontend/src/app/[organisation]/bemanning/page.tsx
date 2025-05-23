import {
  CompetenceReadModel,
  DisciplineReadModel,
  ConsultantReadModel,
  DepartmentReadModel,
  EngagementPerCustomerReadModel,
} from "@/api-types";
import { ConsultantFilterProvider } from "@/hooks/ConsultantFilterProvider";
import { parseYearWeekFromUrlString } from "@/data/urlUtils";
import React from "react";
import { StaffingContent } from "@/pagecontent/StaffingContent";
import {
  fetchEmployeesWithImageAndToken,
  fetchWithToken,
} from "@/data/apiCallsWithToken";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bemanning | VIBES",
};

export default async function Bemanning({
  params,
  searchParams,
}: {
  params: { organisation: string };
  searchParams: { selectedWeek?: string; weekSpan?: string };
}) {
  const selectedWeek = parseYearWeekFromUrlString(
    searchParams.selectedWeek || undefined,
  );
  const weekSpan = searchParams.weekSpan || undefined;
  console.time("Staffing page.tsx fetch all");
  const [consultants, departments, competences, disciplines, customers] =
    await Promise.all([
      fetchEmployeesWithImageAndToken(
        `${params.organisation}/staffings${
          selectedWeek
            ? `?Year=${selectedWeek.year}&Week=${selectedWeek.weekNumber}`
            : ""
        }${weekSpan ? `${selectedWeek ? "&" : "?"}WeekSpan=${weekSpan}` : ""}`,
      ),
      fetchWithToken<DepartmentReadModel[]>(
        `organisations/${params.organisation}/departments`,
      ),
      fetchWithToken<CompetenceReadModel[]>(`competences`),
      fetchWithToken<DisciplineReadModel[]>(`disciplines`),
      fetchWithToken<EngagementPerCustomerReadModel[]>(
        `${params.organisation}/projects`,
      ),
    ]);
  console.timeEnd("Staffing page.tsx fetch all");
  return (
    <ConsultantFilterProvider
      consultants={consultants ?? []}
      departments={departments ?? []}
      competences={competences ?? []}
      disciplines={disciplines ?? []}
      customers={customers ?? []}
    >
      <StaffingContent />
    </ConsultantFilterProvider>
  );
}

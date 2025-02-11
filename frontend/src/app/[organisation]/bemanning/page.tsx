import {
  CompetenceReadModel,
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
  const [consultants, departments, competences, customers] = await Promise.all([
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
    fetchWithToken<EngagementPerCustomerReadModel[]>(
      `${params.organisation}/projects`,
    ),
  ]);
  return (
    <ConsultantFilterProvider
      consultants={consultants ?? []}
      departments={departments ?? []}
      competences={competences ?? []}
      customers={customers ?? []}
    >
      <StaffingContent />
    </ConsultantFilterProvider>
  );
}

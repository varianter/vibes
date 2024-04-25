import {
  CompetenceReadModel,
  ConsultantReadModel,
  DepartmentReadModel,
  EngagementPerCustomerReadModel,
} from "@/api-types";
import { ConsultantFilterProvider } from "@/hooks/ConsultantFilterProvider";
import { parseYearWeekFromUrlString } from "@/data/urlUtils";
import React from "react";
import { fetchWithToken } from "@/data/apiCallsWithToken";
import { ReportContent } from "@/components/staffingReports/ReportContent";

export default async function Rapport({
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

  const consultants =
    (await fetchWithToken<ConsultantReadModel[]>(
      `${params.organisation}/staffings${
        selectedWeek
          ? `?Year=${selectedWeek.year}&Week=${selectedWeek.weekNumber}`
          : ""
      }${weekSpan ? `${selectedWeek ? "&" : "?"}WeekSpan=${weekSpan}` : ""}`,
    )) ?? [];

  const departments =
    (await fetchWithToken<DepartmentReadModel[]>(
      `organisations/${params.organisation}/departments`,
    )) ?? [];

  const competences =
    (await fetchWithToken<CompetenceReadModel[]>(`competences`)) ?? [];

  const customers =
    (await fetchWithToken<EngagementPerCustomerReadModel[]>(
      `${params.organisation}/projects`,
    )) ?? [];

  return (
    <ConsultantFilterProvider
      consultants={consultants}
      departments={departments}
      competences={competences}
      customers={customers}
    >
      <ReportContent />
    </ConsultantFilterProvider>
  );
}

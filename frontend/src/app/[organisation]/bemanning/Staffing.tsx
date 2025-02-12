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

export default async function Staffing({
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

  const [consultants, departments, competences, customers, numWorkHours] =
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
      fetchWithToken<EngagementPerCustomerReadModel[]>(
        `${params.organisation}/projects`,
      ),
      fetchWithToken<number>(
        `organisations/${params.organisation}/weeklyWorkHours`,
      ),
    ]);

  return (
    <ConsultantFilterProvider
      consultants={consultants ?? []}
      departments={departments ?? []}
      competences={competences ?? []}
      customers={customers ?? []}
      numWorkHours={numWorkHours ?? 37.5}
    >
      <StaffingContent />
    </ConsultantFilterProvider>
  );
}

import {
  CompetenceReadModel,
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
import { ForecastContent } from "@/pagecontent/ForecastContent";
import { getWeek } from "date-fns";
export const metadata: Metadata = {
  title: "Prognose | VIBES",
};

export default async function Prognose({
  params,
  searchParams,
}: {
  params: { organisation: string };
  searchParams: { selectedWeek?: string; weekSpan?: string };
}) {
  const today = new Date();
  const firstWeekOfCurrentMonth = getWeek(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const now = {
    year: today.getFullYear(),
    weekNumber: firstWeekOfCurrentMonth,
  };
  const selectedWeek = parseYearWeekFromUrlString(
    searchParams.selectedWeek || undefined,
  );
  const weekSpan = "52";

  const consultants =
    (await fetchEmployeesWithImageAndToken(
      `${params.organisation}/staffings${
        now ? `?Year=${now.year}&Week=${now.weekNumber}` : ""
      }${weekSpan ? `${now ? "&" : "?"}WeekSpan=${weekSpan}` : ""}`,
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
      <ForecastContent />
    </ConsultantFilterProvider>
  );
}

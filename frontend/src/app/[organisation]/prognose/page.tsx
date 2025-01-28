import {
  CompetenceReadModel,
  DepartmentReadModel,
  ForecastReadModel,
} from "@/api-types";
import React from "react";
import { fetchWithToken } from "@/data/apiCallsWithToken";
import { Metadata } from "next";
import { ForecastContent } from "@/pagecontent/ForecastContent";
import { ForecastFilterProvider } from "@/hooks/ForecastFilter/ForecastFilterProvider";
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
  const consultantsWithForecasts =
    (await fetchWithToken<ForecastReadModel[]>(
      "variant-norge/forecasts?Date=2025-01-01&MonthCount=12",
    )) ?? [];

  const departments =
    (await fetchWithToken<DepartmentReadModel[]>(
      `organisations/${params.organisation}/departments`,
    )) ?? [];

  const competences =
    (await fetchWithToken<CompetenceReadModel[]>(`competences`)) ?? [];

  return (
    <ForecastFilterProvider
      consultants={consultantsWithForecasts}
      departments={departments}
      competences={competences}
    >
      <ForecastContent />
    </ForecastFilterProvider>
  );
}

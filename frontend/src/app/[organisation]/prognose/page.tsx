import {
  CompetenceReadModel,
  DepartmentReadModel,
  ConsultantWithForecast,
} from "@/api-types";
import React from "react";
import {
  fetchForecastWithToken,
  fetchWithToken,
} from "@/data/apiCallsWithToken";
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
  const [consultantsWithForecasts, departments, competences, numWorkHours] =
    await Promise.all([
      fetchForecastWithToken(`${params.organisation}/forecasts`),
      fetchWithToken<DepartmentReadModel[]>(
        `organisations/${params.organisation}/departments`,
      ),
      fetchWithToken<CompetenceReadModel[]>(`competences`),
      fetchWithToken<number>(
        `organisations/${params.organisation}/weeklyWorkHours`,
      ),
    ]);
  return (
    <ForecastFilterProvider
      consultants={consultantsWithForecasts ?? []}
      departments={departments ?? []}
      competences={competences ?? []}
      numWorkHours={numWorkHours ?? 0}
    >
      <ForecastContent />
    </ForecastFilterProvider>
  );
}

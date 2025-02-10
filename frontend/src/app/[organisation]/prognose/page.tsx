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
  const [consultantsWithForecasts, departments, competences] =
    await Promise.all([
      fetchForecastWithToken(`${params.organisation}/forecasts`),
      fetchWithToken<DepartmentReadModel[]>(
        `organisations/${params.organisation}/departments`,
      ),
      fetchWithToken<CompetenceReadModel[]>(`competences`),
    ]);

  return (
    <ForecastFilterProvider
      consultants={consultantsWithForecasts ?? []}
      departments={departments ?? []}
      competences={competences ?? []}
    >
      <ForecastContent />
    </ForecastFilterProvider>
  );
}

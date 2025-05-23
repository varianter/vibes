import {
  CompetenceReadModel,
  DepartmentReadModel,
  ConsultantWithForecast,
  DisciplineReadModel,
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
  searchParams: { startDate?: string; monthCount?: string };
}) {
  const [consultantsWithForecasts, departments, competences, disciplines] =
    await Promise.all([
      fetchForecastWithToken(
        `${params.organisation}/forecasts?${
          searchParams.startDate ? `Date=${searchParams.startDate}` : ""
        }${searchParams.startDate && searchParams.monthCount ? "&" : ""}${
          searchParams.monthCount ? `MonthCount=${searchParams.monthCount}` : ""
        }`,
      ),
      fetchWithToken<DepartmentReadModel[]>(
        `organisations/${params.organisation}/departments`,
      ),
      fetchWithToken<CompetenceReadModel[]>(`competences`),
      fetchWithToken<DisciplineReadModel[]>(`disciplines`),
    ]);
  return (
    <ForecastFilterProvider
      consultants={consultantsWithForecasts ?? []}
      departments={departments ?? []}
      competences={competences ?? []}
      disciplines={disciplines ?? []}
    >
      <ForecastContent />
    </ForecastFilterProvider>
  );
}

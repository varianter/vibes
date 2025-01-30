import { CompetenceReadModel, DepartmentReadModel } from "@/api-types";
import { Context, useCallback, useContext, useEffect } from "react";
import { toggleValueFromFilter } from "./UrlStringFilter";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";

export function useCompetencesFilter(context: Context<any> = FilteredContext) {
  const { competences } = useContext(context);
  const { updateFilters, activeFilters } = useContext(context);
  const competenceFilter = activeFilters.competenceFilter;

  const filteredCompetences = competenceFilter
    .split(",")
    .map((id: string) =>
      competences.find((d: CompetenceReadModel) => d.id === id),
    )
    .filter(
      (competence: CompetenceReadModel) => competence !== undefined,
    ) as CompetenceReadModel[];

  const toggleCompetenceFilter = useCallback(
    (d: CompetenceReadModel) => {
      const newCompetenceFilter = toggleValueFromFilter(competenceFilter, d.id);
      updateFilters({ competences: newCompetenceFilter });
    },
    [competenceFilter, updateFilters],
  );

  return {
    competences,
    filteredCompetences,
    toggleCompetenceFilter,
  };
}

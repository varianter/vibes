import { CompetenceReadModel, DepartmentReadModel } from "@/api-types";
import { useCallback, useContext, useEffect } from "react";
import { toggleValueFromFilter } from "./UrlStringFilter";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";

export function useCompetencesFilter() {
  const { competences } = useContext(FilteredContext);
  const { updateFilters, activeFilters } = useContext(FilteredContext);
  const competenceFilter = activeFilters.competenceFilter;

  const filteredCompetences = competenceFilter
    .split(",")
    .map((id) => competences.find((d) => d.id === id))
    .filter((dept) => dept !== undefined) as CompetenceReadModel[];

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

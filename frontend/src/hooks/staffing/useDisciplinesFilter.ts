import { DisciplineReadModel } from "@/api-types";
import { Context, useCallback, useContext } from "react";
import { toggleValueFromFilter } from "./UrlStringFilter";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";

export function useDisciplinesFilter(context: Context<any> = FilteredContext) {
  const { disciplines } = useContext(context);
  const { updateFilters, activeFilters } = useContext(context);
  const disciplineFilter = activeFilters.disciplineFilter;

  const filteredDisciplines = disciplineFilter
    .split(",")
    .map((id: string) =>
      disciplines.find((d: DisciplineReadModel) => d.id === id),
    )
    .filter(
      (discipline: DisciplineReadModel) => discipline !== undefined,
    ) as DisciplineReadModel[];

  const toggleDisciplineFilter = useCallback(
    (d: DisciplineReadModel) => {
      const newDisciplineFilter = toggleValueFromFilter(disciplineFilter, d.id);
      updateFilters({ disciplines: newDisciplineFilter });
    },
    [disciplineFilter, updateFilters],
  );

  return {
    disciplines,
    filteredDisciplines,
    toggleDisciplineFilter: toggleDisciplineFilter,
  };
}

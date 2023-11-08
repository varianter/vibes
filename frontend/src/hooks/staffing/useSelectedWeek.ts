import { DateTime } from "luxon";
import { useUrlRouteFilter } from "./useUrlRouteFilter";

export function useSelectedWeek() {
  const { updateRoute, selectedWeekFilter } = useUrlRouteFilter();

  function changeSelectedWeek(numberOfWeeks: number) {
    const date = selectedWeekFilter
      ? DateTime.now().set({
          weekYear: selectedWeekFilter.year,
          weekNumber: selectedWeekFilter.weekNumber,
        })
      : DateTime.now();

    const newDate = date.plus({ week: numberOfWeeks });

    updateRoute({
      week: { year: newDate.year, weekNumber: newDate.weekNumber },
    });
  }

  function resetSelectedWeek() {
    updateRoute({});
  }

  return {
    selectedWeek: selectedWeekFilter,
    changeSelectedWeek,
    resetSelectedWeek,
  };
}

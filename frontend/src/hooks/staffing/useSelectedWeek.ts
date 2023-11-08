import { DateTime } from "luxon";
import { useUrlRouteFilter } from "./useUrlRouteFilter";

export function useSelectedWeek() {
  const { updateRoute, selectedWeek } = useUrlRouteFilter();

  function changeSelectedWeek(numberOfWeeks: number) {
    const date = selectedWeek
      ? DateTime.now().set({
          weekYear: selectedWeek.year,
          weekNumber: selectedWeek.weekNumber,
        })
      : DateTime.now();

    const newDate = date.plus({ week: numberOfWeeks });

    updateRoute({
      week: { year: newDate.year, weekNumber: newDate.weekNumber },
    });
  }

  return { selectedWeek, changeSelectedWeek };
}

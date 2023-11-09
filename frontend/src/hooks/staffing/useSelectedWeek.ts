import { DateTime } from "luxon";
import { useUrlRouteFilter } from "./useUrlRouteFilter";

export function useSelectedWeek() {
  const { updateRoute, selectedWeekFilter, weekSpan } = useUrlRouteFilter();

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

  function setWeekSpan(weekSpanString: string) {
    const weekSpanNum = parseInt(weekSpanString.split(" ")[0]);
    updateRoute({ numWeeks: weekSpanNum });
  }

  function resetSelectedWeek() {
    updateRoute({
      week: {
        year: DateTime.now().year,
        weekNumber: DateTime.now().weekNumber,
      },
    });
  }

  function incrementSelectedWeek() {
    changeSelectedWeek(weekSpan - 1);
  }

  function decrementSelectedWeek() {
    changeSelectedWeek(-(weekSpan - 1));
  }

  return {
    selectedWeek: selectedWeekFilter,
    changeSelectedWeek,
    resetSelectedWeek,
    incrementSelectedWeek,
    decrementSelectedWeek,
    setWeekSpan,
  };
}

import { DateTime } from "luxon";
import { useContext } from "react";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";

export function useSelectedWeek() {
  const { updateFilters, activeFilters } = useContext(FilteredContext);

  const { selectedWeekFilter, weekSpan } = activeFilters;

  function changeSelectedWeek(numberOfWeeks: number) {
    const date = selectedWeekFilter
      ? DateTime.now().set({
          weekYear: selectedWeekFilter.year,
          weekNumber: selectedWeekFilter.weekNumber,
        })
      : DateTime.now();

    const newDate = date.plus({ week: numberOfWeeks });

    updateFilters({
      week: { year: newDate.year, weekNumber: newDate.weekNumber },
    });
  }

  function setWeekSpan(weekSpanString: string) {
    const weekSpanNum = parseInt(weekSpanString.split(" ")[0]);
    updateFilters({ numWeeks: weekSpanNum });
  }

  function resetSelectedWeek() {
    updateFilters({
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

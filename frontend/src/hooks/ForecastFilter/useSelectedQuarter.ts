import { Context, useContext } from "react";
import { DateTime } from "luxon";
import { FilteredForecastContext } from "./ForecastFilterProvider";

export function useSelectedQuarter(
  context: Context<any> = FilteredForecastContext,
) {
  const { updateFilters, activeFilters } = useContext(context);
  const { startDate, monthCount } = activeFilters;

  function changeSelectedQuarter(increase: boolean) {
    const date = startDate ? DateTime.fromISO(startDate) : DateTime.now();
    const newDate = increase
      ? date.plus({ month: 3 })
      : date.minus({ month: 3 });

    updateFilters({
      startDate: newDate.toISODate(),
      count: monthCount,
    });
  }

  function setMonthCount(monthCount: number) {
    updateFilters({ count: monthCount });
  }

  function resetSelectedQuarter() {
    updateFilters({
      startDate: DateTime.now().toISODate(),
    });
  }

  function incrementSelectedQuarter() {
    changeSelectedQuarter(true);
  }

  function decrementSelectedQuarter() {
    changeSelectedQuarter(false);
  }

  return {
    startDate,
    changeSelectedQuarter,
    resetSelectedQuarter,
    incrementSelectedQuarter,
    decrementSelectedQuarter,
    setMonthCount,
  };
}

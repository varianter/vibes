import { Context, useContext } from "react";
import { DateTime } from "luxon";
import { FilteredForecastContext } from "./ForecastFilterProvider";

export function useSelectedMonth(
  context: Context<any> = FilteredForecastContext,
) {
  const { updateFilters, activeFilters } = useContext(context);
  const { startDate, monthCount } = activeFilters;

  function changeSelectedMonth(increase: boolean) {
    const date = startDate ? DateTime.fromISO(startDate) : DateTime.now();
    //finds thursday in week. allways correct year
    const newDate = increase
      ? date.plus({ month: 4 })
      : date.minus({ month: 4 });

    updateFilters({
      startDate: newDate.toISODate(),
      count: monthCount,
    });
  }

  function setMonthCount(monthCount: number) {
    updateFilters({ count: monthCount });
  }

  function resetSelectedMonth() {
    updateFilters({
      startDate: DateTime.now().toISODate(),
    });
  }

  function incrementSelectedMonth() {
    changeSelectedMonth(true);
  }

  function decrementSelectedMonth() {
    changeSelectedMonth(false);
  }

  return {
    startDate,
    changeSelectedMonth,
    resetSelectedMonth,
    incrementSelectedMonth,
    decrementSelectedMonth,
    setMonthCount,
  };
}

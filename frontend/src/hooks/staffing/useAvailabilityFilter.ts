"use client";

import { Context, useCallback, useContext, useEffect } from "react";
import { FilteredContext } from "../ConsultantFilterProvider";

export function useAvailabilityFilter(context: Context<any> = FilteredContext) {
  const { isDisabledHotkeys, updateFilters, activeFilters } =
    useContext(context);
  const availabilityFilterOn = activeFilters.availabilityFilter;

  const setAvailabilityFilter = useCallback(
    (availableFilterOn: boolean) => {
      updateFilters({ availability: availableFilterOn });
    },
    [updateFilters],
  );

  const toggleAvailabilityFilter = useCallback(
    () => setAvailabilityFilter(!availabilityFilterOn),
    [availabilityFilterOn, setAvailabilityFilter],
  );

  useEffect(() => {
    function keyDownHandler(e: { code: string }) {
      if (isDisabledHotkeys) return;
      if (e.code.includes("Period")) {
        toggleAvailabilityFilter();
      }
    }
    document.addEventListener("keydown", keyDownHandler);

    // clean up
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [isDisabledHotkeys, toggleAvailabilityFilter]);

  return {
    availabilityFilterOn,
    toggleAvailabilityFilter,
    updateRoute: updateFilters,
  };
}

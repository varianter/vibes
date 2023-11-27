"use client";

import { useCallback, useContext, useEffect } from "react";
import { useUrlRouteFilter } from "./useUrlRouteFilter";
import { FilteredContext } from "../ConsultantFilterProvider";

export function useAvailabilityFilter() {
  const { updateRoute } = useUrlRouteFilter();
  const { availabilityFilter } = useUrlRouteFilter();
  const availabilityFilterOn = availabilityFilter === "true";
  const { isDisabledHotkeys } = useContext(FilteredContext);

  const setAvailabilityFilter = useCallback(
    (availabelFilterOn: Boolean) => {
      updateRoute({ availability: availabelFilterOn });
    },
    [updateRoute],
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
    updateRoute,
  };
}

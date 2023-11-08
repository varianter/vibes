"use client";

import { useCallback, useEffect } from "react";
import { useUrlRouteFilter } from "./useUrlRouteFilter";

export function useAvailabilityFilter() {
  const { updateRoute } = useUrlRouteFilter();
  const { availabilityFilter } = useUrlRouteFilter();
  const availabilityFilterOn = availabilityFilter === "true";

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
      if (e.code.includes("Period")) {
        toggleAvailabilityFilter();
      }
    }
    document.addEventListener("keydown", keyDownHandler);

    // clean up
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [toggleAvailabilityFilter]);

  return {
    availabilityFilterOn,
    toggleAvailabilityFilter,
    updateRoute,
  };
}

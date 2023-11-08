"use client";

import { useCallback } from "react";
import { useUrlRouteFilter } from "./useUrlRouteFilter";

export function useAvailabilityFilter() {
  const { updateRoute } = useUrlRouteFilter();
  const { availabilityFilter } = useUrlRouteFilter();

  const toggleAvailabilityFilter = useCallback(
    (availabelFilterOn: Boolean) => {
      updateRoute({ availability: availabelFilterOn });
    },
    [updateRoute],
  );

  const availabilityFilterOn = availabilityFilter === "true";

  return {
    availabilityFilterOn,
    toggleAvailabilityFilter,
    updateRoute,
  };
}

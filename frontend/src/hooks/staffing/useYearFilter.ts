"use client";

import { YearRange } from "@/types";
import { useCallback } from "react";
import { toggleValueFromFilter } from "./UrlStringFilter";
import { useUrlRouteFilter } from "./useUrlRouteFilter";
import { yearRanges } from "@/components/ExperienceFilter";

export function useYearFilter() {
  const { yearFilter, updateRoute } = useUrlRouteFilter();

  const filteredYears = yearFilter
    .split(",")
    .map((urlString) => yearRanges.find((y) => y.urlString === urlString))
    .filter((year) => year !== undefined) as YearRange[];

  const toggleYearFilter = useCallback(
    (y: YearRange) => {
      const newYearFilter = toggleValueFromFilter(yearFilter, y.urlString);
      updateRoute({ years: newYearFilter });
    },
    [updateRoute, yearFilter],
  );

  return {
    filteredYears,
    toggleYearFilter,
    updateRoute,
  };
}

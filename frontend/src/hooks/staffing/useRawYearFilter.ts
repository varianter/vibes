"use client";

import { YearRange } from "@/types";
import { useCallback, useContext } from "react";
import { toggleValueFromFilter } from "./UrlStringFilter";
import { rawYearRanges } from "@/components/ExperienceFilter";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";

export function useRawYearsFilter() {
  const { updateFilters, activeFilters } = useContext(FilteredContext);
  const { rawYearFilter } = activeFilters;

  const filteredYears = rawYearFilter
    .split(",")
    .map((urlString) => rawYearRanges.find((y) => y.urlString === urlString))
    .filter((year) => year !== undefined) as YearRange[];

  const toggleYearFilter = useCallback(
    (y: YearRange) => {
      const newYearFilter = toggleValueFromFilter(rawYearFilter, y.urlString);
      updateFilters({ years: newYearFilter });
    },
    [updateFilters, rawYearFilter],
  );

  return {
    filteredYears,
    toggleYearFilter,
    updateRoute: updateFilters,
  };
}

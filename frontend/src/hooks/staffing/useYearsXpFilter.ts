"use client";

import { YearRange } from "@/types";
import { useCallback, useContext } from "react";
import { toggleValueFromFilter } from "./UrlStringFilter";
import { yearRanges } from "@/components/ExperienceFilter";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";

export function useYearsXpFilter() {
  const { updateFilters, activeFilters } = useContext(FilteredContext);
  const { yearFilter } = activeFilters;

  const filteredYears = yearFilter
    .split(",")
    .map((urlString) => yearRanges.find((y) => y.urlString === urlString))
    .filter((year) => year !== undefined) as YearRange[];

  const toggleYearFilter = useCallback(
    (y: YearRange) => {
      const newYearFilter = toggleValueFromFilter(yearFilter, y.urlString);
      updateFilters({ years: newYearFilter });
    },
    [updateFilters, yearFilter],
  );

  return {
    filteredYears,
    toggleYearFilter,
    updateRoute: updateFilters,
  };
}

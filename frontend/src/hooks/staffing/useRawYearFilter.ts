"use client";

import { YearRange } from "@/types";
import { Context, useCallback, useContext } from "react";
import { toggleValueFromFilter } from "./UrlStringFilter";
import { rawYearRanges } from "@/components/RawYearsFilter";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";

export function useRawYearsFilter(context: Context<any> = FilteredContext) {
  const { updateFilters, activeFilters } = useContext(context);
  const { rawYearFilter } = activeFilters;

  const filteredYears = rawYearFilter
    .split(",")
    .map((urlString: string) =>
      rawYearRanges.find((y) => y.urlString === urlString),
    )
    .filter((year: YearRange) => year !== undefined) as YearRange[];

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

"use client";

import { useContext, useEffect, useState } from "react";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";

export function useExperienceFilter() {
  const { updateFilters, activeFilters } = useContext(FilteredContext);
  const experienceFromFilter = activeFilters.experienceFromFilter;
  const experienceToFilter = activeFilters.experienceToFilter;

  const [activeExperienceFrom, setActiveExperienceFrom] =
    useState<string>(experienceFromFilter);

  const [activeExperienceTo, setActiveExperienceTo] =
    useState<string>(experienceToFilter);

  useEffect(() => {
    updateFilters({
      experienceFrom: activeExperienceFrom,
      experienceTo: activeExperienceTo,
    });
  }, [activeExperienceFrom, activeExperienceTo, updateFilters]);

  return {
    activeExperienceFrom,
    activeExperienceTo,
    setActiveExperienceFrom,
    setActiveExperienceTo,
  };
}

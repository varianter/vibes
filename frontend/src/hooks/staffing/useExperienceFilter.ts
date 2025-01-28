"use client";

import { Context, useContext, useEffect, useState } from "react";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";

export function useExperienceFilter(context: Context<any> = FilteredContext) {
  const { updateFilters, activeFilters } = useContext(context);
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

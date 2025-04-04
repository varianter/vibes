"use client";
import { useDepartmentFilter } from "@/hooks/staffing/useDepartmentFilter";
import { useRawYearsFilter } from "@/hooks/staffing/useRawYearFilter";
import { useAvailabilityFilter } from "@/hooks/staffing/useAvailabilityFilter";
import { Context, useContext } from "react";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";

export default function ActiveFilters({
  context = FilteredContext,
}: {
  context?: Context<any>;
}) {
  const filterTextComponents: string[] = [];
  const { activeFilters } = useContext(context);

  const { searchFilter } = activeFilters;
  const { filteredDepartments } = useDepartmentFilter(context);
  const { filteredYears } = useRawYearsFilter(context);
  const { availabilityFilterOn } = useAvailabilityFilter(context);
  const { experienceFromFilter, experienceToFilter } = activeFilters;

  if (experienceFromFilter != "" && experienceToFilter == "") {
    filterTextComponents.push(`Fra ${experienceFromFilter} års erfaring`);
  }

  if (experienceFromFilter == "" && experienceToFilter != "") {
    filterTextComponents.push(`Til ${experienceToFilter} års erfaring`);
  }

  if (experienceFromFilter != "" && experienceToFilter != "") {
    filterTextComponents.push(
      `Fra ${experienceFromFilter} til ${experienceToFilter} års erfaring`,
    );
  }

  if (searchFilter != "") filterTextComponents.push(` "${searchFilter}"`);

  if (filteredDepartments.length > 0)
    filterTextComponents.push(
      ` ${filteredDepartments.map((d) => d.name).join(", ")}`,
    );

  if (filteredYears.length > 0) {
    filterTextComponents.push(
      ` ${filteredYears.map((yr) => yr.label).join(", ")}`,
    );
  }

  if (availabilityFilterOn) {
    filterTextComponents.push(" Ledig tid");
  }

  const filterSummaryText = filterTextComponents.join(", ");

  return (
    <div className="h-4">
      {filterSummaryText != "" && (
        <p className="small-medium text-primary"> {filterSummaryText} </p>
      )}
    </div>
  );
}

"use client";
import { useDepartmentFilter } from "@/hooks/staffing/useDepartmentFilter";
import { useRawYearsFilter } from "@/hooks/staffing/useRawYearFilter";
import { useAvailabilityFilter } from "@/hooks/staffing/useAvailabilityFilter";
import { useContext } from "react";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";

export default function ActiveFilters() {
  const filterTextComponents: string[] = [];
  const { activeFilters } = useContext(FilteredContext);

  const { searchFilter } = activeFilters;
  const { filteredDepartments } = useDepartmentFilter();
  const { filteredYears } = useRawYearsFilter();
  const { availabilityFilterOn } = useAvailabilityFilter();

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
        <p className="small-medium"> {filterSummaryText} </p>
      )}
    </div>
  );
}

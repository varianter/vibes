"use client";
import { Filter } from "react-feather";
import { useUrlRouteFilter } from "@/hooks/staffing/useUrlRouteFilter";
import { useDepartmentFilter } from "@/hooks/staffing/useDepartmentFilter";
import { useYearsXpFilter } from "@/hooks/staffing/useYearsXpFilter";
import { useAvailabilityFilter } from "@/hooks/staffing/useAvailabilityFilter";

export default function ActiveFilters({ showIcon }: { showIcon: boolean }) {
  const filterTextComponents: string[] = [];

  const { searchFilter } = useUrlRouteFilter();
  const { filteredDepartments } = useDepartmentFilter();
  const { filteredYears } = useYearsXpFilter();
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

"use client";
import { Filter } from "react-feather";
import { useUrlRouteFilter } from "@/hooks/staffing/useUrlRouteFilter";
import { useDepartmentFilter } from "@/hooks/staffing/useDepartmentFilter";
import { useYearFilter } from "@/hooks/staffing/useYearFilter";

export default function ActiveFilters() {
  const filterTextComponents: string[] = [];

  const { searchFilter } = useUrlRouteFilter();
  const { filteredDepartments } = useDepartmentFilter();
  const { filteredYears } = useYearFilter();

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

  const filterSummaryText = filterTextComponents.join(", ");

  return (
    <div className="h-4">
      {filterSummaryText != "" && (
        <div className="flex flex-row gap-[5px] text-primary_default items-center">
          <Filter size="12" />{" "}
          <p className="body-small-bold"> {filterSummaryText} </p>
        </div>
      )}
    </div>
  );
}

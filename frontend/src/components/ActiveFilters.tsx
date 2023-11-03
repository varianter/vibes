"use client";
import { Filter } from "react-feather";
import { useFilteredConsultants } from "@/hooks/useFilteredConsultants";

export default function ActiveFilters() {
  const { filteredDepartments, searchFilter, filteredYears } =
    useFilteredConsultants();
  const filterTextComponents: string[] = [];

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
    <>
      {filterSummaryText != "" ? (
        <div className="flex flex-row gap-[5px] text-primary_default items-center">
          <Filter size="12" />{" "}
          <p className="body-small-bold"> {filterSummaryText} </p>
        </div>
      ) : (
        <div className="h-4" />
      )}
    </>
  );
}

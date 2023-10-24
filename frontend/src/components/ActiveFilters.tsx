"use client";
import { Filter } from "react-feather";
import { useFilteredConsultants } from "@/hooks/useFilteredConsultants";

export default function ActiveFilters() {
  const { filteredDepartments, currentNameSearch } = useFilteredConsultants();
  const filterTextComponents: string[] = [];

  if (filteredDepartments.length > 0)
    filterTextComponents.push(
      filteredDepartments.map((d) => d.name).join(", "),
    );
  if (currentNameSearch != "")
    filterTextComponents.push(`"${currentNameSearch}"`);

  const filterSummaryText = filterTextComponents.join(" ");

  return (
    <>
      {filterSummaryText != "" && (
        <div className="flex flex-row gap-[5px] text-primary_default items-center">
          <Filter size="12" />{" "}
          <p className="body-small-bold"> {filterSummaryText} </p>
        </div>
      )}
    </>
  );
}

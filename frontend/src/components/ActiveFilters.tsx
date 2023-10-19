"use client";
import { useSearchParams } from "next/navigation";
import { Filter } from "react-feather";

export default function ActiveFilters() {
  const searchParams = useSearchParams();

  const currentNameSearch =
    searchParams.get("search") != ""
      ? `"` + searchParams.get("search") + `"`
      : "";
  const filteredDepartments =
    searchParams.get("filter") != ""
      ? searchParams.get("filter")?.split(",").join(", ")
      : "";
  const filterSummaryText =
    filteredDepartments != "" && currentNameSearch != ""
      ? [filteredDepartments, currentNameSearch].join(", ").replace(/,^/, "")
      : filteredDepartments + currentNameSearch;

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

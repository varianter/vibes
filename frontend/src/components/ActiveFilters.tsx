"use client";
import { useSearchParams } from "next/navigation";
import { Filter } from "react-feather";

export default function ActiveFilters() {
  const searchParams = useSearchParams();

  const currentSearch =
    searchParams.get("search") != ""
      ? `"` + searchParams.get("search") + `"`
      : "";
  const currentFilter =
    searchParams.get("filter") != ""
      ? searchParams.get("filter")?.split(",").join(", ")
      : "";
  const activeFilters =
    currentFilter != "" && currentSearch != ""
      ? [currentFilter, currentSearch].join(", ").replace(/,^/, "")
      : currentFilter + currentSearch;

  return (
    <>
      {activeFilters != "" && (
        <div className="flex flex-row gap-[5px] text-primary_default items-center">
          <Filter size="12" />{" "}
          <p className="body-small-bold"> {activeFilters} </p>
        </div>
      )}
    </>
  );
}

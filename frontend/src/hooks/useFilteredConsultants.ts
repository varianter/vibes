"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Consultant, Department } from "@/types";
import { useContext, useEffect, useState } from "react";
import { FilteredContext } from "@/components/FilteredConsultantProvider";

export function useFilteredConsultants() {
  const { departments, consultants } = useContext(FilteredContext);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  console.log("useFilter");

  const currentSearch = searchParams.get("search") || "";
  const currentFilter = searchParams.get("filter") || "";
  const filteredDepartments = currentFilter
    .split(",")
    .map((id) => departments.find((d) => d.id === id))
    .filter((dept) => dept !== undefined) as Department[];

  const filteredConsultants = filterConsultants(
    currentSearch,
    currentFilter,
    consultants,
  );

  function setNameSearch(newSearch: string) {
    const currentFilter = searchParams.get("filter") || "";
    router.push(`${pathname}?search=${newSearch}&filter=${currentFilter}`);
  }

  function clearNameSearch() {}

  function toggleDepartmentFilter(d: Department) {
    const currentSearch = searchParams.get("search");
    const currentFilter = searchParams.get("filter") || "";
    const filters = currentFilter.split(",");
    const filterIndex = filters.indexOf(d.id);
    const newFilters = [...filters];
    if (filterIndex === -1) {
      newFilters.push(d.id);
    } else {
      newFilters.splice(filterIndex, 1);
    }
    const newFilterString = newFilters.join(",").replace(/^,/, "");

    router.push(
      `${pathname}?search=${currentSearch}&filter=${newFilterString}`,
    );
  }

  function clearDepartmentFilter() {}

  function clearAll() {
    router.push(`${pathname}?search=&filter=`);
  }

  return {
    consultants,
    filteredConsultants,
    departments,
    filteredDepartments,
    currentNameSearch: currentSearch,
    setNameSearch,
    clearNameSearch,
    toggleDepartmentFilter,
    clearDepartmentFilter,
    clearAll,
  };
}

function filterConsultants(
  search: string,
  filter: string,
  consultants: Consultant[],
) {
  var newFilteredConsultants = consultants;
  if (search && search.length > 0) {
    newFilteredConsultants = newFilteredConsultants?.filter((consultant) =>
      consultant.name.match(new RegExp(`\\b${search}.*\\b`, "gi")),
    );
  }
  if (filter && filter.length > 0) {
    newFilteredConsultants = newFilteredConsultants?.filter((consultant) =>
      filter.toLowerCase().includes(consultant.department.toLowerCase()),
    );
  }
  return newFilteredConsultants;
}

/*

  useEffect(() => {
    function keyDownHandler(e: { code: string }) {
      if (
        (e.code.startsWith("Key") || e.code.includes("Backspace")) &&
        inputRef &&
        inputRef.current
      ) {
        inputRef.current.focus();
      }
      if (e.code.includes("Escape")) {
        setSearchText("");
      }
      if (e.code.startsWith("Digit")) {
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", keyDownHandler);

    // clean up
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);
 */

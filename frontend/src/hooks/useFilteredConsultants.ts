"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Consultant, Department, YearRange } from "@/types";
import { useCallback, useContext, useEffect } from "react";
import { FilteredContext } from "@/components/FilteredConsultantProvider";
import { yearRanges } from "@/components/ExperienceFilter";

export function useFilteredConsultants() {
  const { departments, consultants } = useContext(FilteredContext);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentDepartmentFilter = searchParams.get("depFilter") || "";
  const currentYearFilter = searchParams.get("yearFilter") || "";

  const filteredDepartments = currentDepartmentFilter
    .split(",")
    .map((id) => departments.find((d) => d.id === id))
    .filter((dept) => dept !== undefined) as Department[];

  const filteredYears = currentYearFilter
    .split(",")
    .map((urlString) => yearRanges.find((y) => y.urlString === urlString))
    .filter((year) => year !== undefined) as YearRange[];

  const filteredConsultants = filterConsultants(
    currentSearch,
    currentDepartmentFilter,
    filteredYears,
    consultants,
  );

  function setNameSearch(newSearch: string) {
    const currentDepartmentFilter = searchParams.get("depFilter") || "";
    const currentYearFilter = searchParams.get("yearFilter") || "";
    router.push(
      `${pathname}?search=${newSearch}&depFilter=${currentDepartmentFilter}&yearFilter=${currentYearFilter}`,
    );
  }

  function clearNameSearch() {
    const currentFilter = searchParams.get("depFilter") || "";
    const currentYearFilter = searchParams.get("yearFilter") || "";

    router.push(
      `${pathname}?search=&depFilter=${currentFilter}&yearFilter=${currentYearFilter}`,
    );
  }

  const toggleDepartmentFilter = useCallback(
    (d: Department) => {
      const currentSearch = searchParams.get("search") || "";
      const currentFilter = searchParams.get("depFilter") || "";
      const currentYearFilter = searchParams.get("yearFilter") || "";
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
        `${pathname}?search=${currentSearch}&depFilter=${newFilterString}&yearFilter=${currentYearFilter}`,
      );
    },
    [searchParams, router, pathname],
  );

  const clearDepartmentFilter = useCallback(() => {
    const currentSearch = searchParams.get("search") || "";
    const currentYearFilter = searchParams.get("yearFilter") || "";

    router.push(
      `${pathname}?search=${currentSearch}&depFilter=&yearFilter=${currentYearFilter}`,
    );
  }, [pathname, router, searchParams]);

  const toggleYearFilter = useCallback(
    (y: YearRange) => {
      const currentSearch = searchParams.get("search") || "";
      const currentDepartmentFilter = searchParams.get("depFilter") || "";
      const currentYearFilter = searchParams.get("yearFilter") || "";

      const filters = currentYearFilter.split(",");
      const filterIndex = filters.indexOf(y.urlString);
      const newFilters = [...filters];
      if (filterIndex === -1) {
        newFilters.push(y.urlString);
      } else {
        newFilters.splice(filterIndex, 1);
      }
      const newFilterString = newFilters.join(",").replace(/^,/, "");

      router.push(
        `${pathname}?search=${currentSearch}&depFilter=${currentDepartmentFilter}&yearFilter=${newFilterString}`,
      );
    },
    [pathname, router, searchParams],
  );

  const clearAll = useCallback(() => {
    router.push(`${pathname}?search=&depFilter=&yearFilter=`);
  }, [pathname, router]);

  useEffect(() => {
    function handleDepartmentHotkey(keyCode: string) {
      departments
        .filter((d) => d.hotkey)
        .filter((d) => keyCode.includes(`${d.hotkey!}`))
        .forEach((d) => toggleDepartmentFilter(d));
    }

    function keyDownHandler(e: { code: string }) {
      if (
        e.code.startsWith("Digit") &&
        (document.activeElement?.tagName.toLowerCase() !== "input" ||
          document.activeElement?.id === "checkbox")
      ) {
        handleDepartmentHotkey(e.code);
      }
      if (e.code.includes("0")) {
        clearDepartmentFilter();
      }
    }
    document.addEventListener("keydown", keyDownHandler);

    // clean up
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [clearAll, clearDepartmentFilter, departments, toggleDepartmentFilter]);

  return {
    consultants,
    filteredConsultants,
    departments,
    filteredDepartments,
    filteredYears,
    currentNameSearch: currentSearch,
    setNameSearch,
    toggleDepartmentFilter,
    toggleYearFilter,
    clearDepartmentFilter,
    clearAll,
  };
}

function filterConsultants(
  search: string,
  departmentFilter: string,
  yearFilter: YearRange[],
  consultants: Consultant[],
) {
  let newFilteredConsultants = consultants;
  if (search && search.length > 0) {
    newFilteredConsultants = newFilteredConsultants?.filter((consultant) =>
      consultant.name.match(new RegExp(`(?<!\\p{L})${search}.*\\b`, "giu")),
    );
  }
  if (departmentFilter && departmentFilter.length > 0) {
    newFilteredConsultants = newFilteredConsultants?.filter((consultant) =>
      departmentFilter
        .toLowerCase()
        .includes(consultant.department.toLowerCase()),
    );
  }
  if (yearFilter.length > 0) {
    newFilteredConsultants = newFilteredConsultants.filter((consultant) =>
      inYearRanges(consultant, yearFilter),
    );
  }
  return newFilteredConsultants;
}

function inYearRanges(consultant: Consultant, yearRanges: YearRange[]) {
  for (const range of yearRanges) {
    if (
      consultant.yearsOfExperience > range.start &&
      (!range.end || consultant.yearsOfExperience < range.end)
    )
      return true;
  }
  return false;
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

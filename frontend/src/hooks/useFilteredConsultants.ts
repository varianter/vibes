"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Consultant, Department, YearRange } from "@/types";
import { useCallback, useContext, useEffect, useState } from "react";
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

  const [activeNameSearch, setActiveNameSearch] =
    useState<string>(currentSearch);
  const [lastSearchKeyStrokeTime, setLastSearchKeyStrokeTime] =
    useState<number>();

  useEffect(() => {
    let nameSearchDebounceTimer = setTimeout(() => {
      if (
        lastSearchKeyStrokeTime &&
        Date.now() - lastSearchKeyStrokeTime > 250
      ) {
        router.push(
          `${pathname}?search=${activeNameSearch}&depFilter=${currentDepartmentFilter}&yearFilter=${currentYearFilter}`,
        );
      }
    }, 250);

    // this will clear Timeout
    // when component unmount like in willComponentUnmount
    // and show will not change to true
    return () => {
      clearTimeout(nameSearchDebounceTimer);
    };
  }, [
    lastSearchKeyStrokeTime,
    activeNameSearch,
    searchParams,
    router,
    pathname,
    currentDepartmentFilter,
    currentYearFilter,
  ]);

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
    setActiveNameSearch(newSearch);
    setLastSearchKeyStrokeTime(Date.now());
  }

  const toggleDepartmentFilter = useCallback(
    (d: Department) => {
      const newDepartmentFilter = filterString(currentDepartmentFilter, d.id);
      router.push(
        `${pathname}?search=${currentSearch}&depFilter=${newDepartmentFilter}&yearFilter=${currentYearFilter}`,
      );
    },
    [
      currentDepartmentFilter,
      router,
      pathname,
      currentSearch,
      currentYearFilter,
    ],
  );

  const clearDepartmentFilter = useCallback(() => {
    router.push(
      `${pathname}?search=${currentSearch}&depFilter=&yearFilter=${currentYearFilter}`,
    );
  }, [currentSearch, currentYearFilter, pathname, router]);

  const toggleYearFilter = useCallback(
    (y: YearRange) => {
      const newYearFilter = filterString(currentYearFilter, y.urlString);

      router.push(
        `${pathname}?search=${currentSearch}&depFilter=${currentDepartmentFilter}&yearFilter=${newYearFilter}`,
      );
    },
    [
      currentDepartmentFilter,
      currentSearch,
      currentYearFilter,
      pathname,
      router,
    ],
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
    currentNameSearch: activeNameSearch,
    currentSearch,
    setNameSearch,
    toggleDepartmentFilter,
    toggleYearFilter,
    clearDepartmentFilter,
    clearAll,
  };
}

function filterString(existingFilters: string, sortByString: string) {
  const filters = existingFilters.split(",");
  const filterIndex = filters.indexOf(sortByString);
  const newFilters = [...filters];
  if (filterIndex === -1) {
    newFilters.push(sortByString);
  } else {
    newFilters.splice(filterIndex, 1);
  }
  const newFilterString = newFilters.join(",").replace(/^,/, "");
  return newFilterString;
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
      consultant.yearsOfExperience >= range.start &&
      (!range.end || consultant.yearsOfExperience <= range.end)
    )
      return true;
  }
  return false;
}

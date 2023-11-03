"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Consultant, Department, Week, YearRange } from "@/types";
import { useCallback, useContext, useEffect, useState } from "react";
import { FilteredContext } from "@/components/FilteredConsultantProvider";
import { yearRanges } from "@/components/ExperienceFilter";
import { DateTime } from "luxon";
import { stringToWeek, weekToString } from "@/data/urlUtils";

interface UpdateFilterParams {
  search?: string;
  departments?: string;
  years?: string;
  week?: Week;
  numWeeks?: number;
}

export function useFilteredConsultants() {
  const { departments, consultants } = useContext(FilteredContext);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchFilter = searchParams.get("search") || "";
  const departmentFilter = searchParams.get("depFilter") || "";
  const yearFilter = searchParams.get("yearFilter") || "";
  const selectedWeek = stringToWeek(
    searchParams.get("selectedWeek") || undefined,
  );
  const weekSpan = searchParams.get("weekSpan") || undefined;

  const [activeNameSearch, setActiveNameSearch] =
    useState<string>(searchFilter);
  const [lastSearchKeyStrokeTime, setLastSearchKeyStrokeTime] =
    useState<number>();

  const updateRoute = useCallback(
    (updateParams: UpdateFilterParams) => {
      // If not defined, defaults to current value:
      const { search = searchFilter } = updateParams;
      const { departments = departmentFilter } = updateParams;
      const { years = yearFilter } = updateParams;
      const { week = selectedWeek } = updateParams;
      const { numWeeks = weekSpan } = updateParams;

      console.log("Update route with numWeeks = " + numWeeks);
      router.push(
        `${pathname}?search=${search}&depFilter=${departments}&yearFilter=${years}${
          week ? `&selectedWeek=${weekToString(week)}` : ""
        }${numWeeks ? `&weekSpan=${numWeeks}` : ""}`,
      );
    },
    [
      departmentFilter,
      pathname,
      router,
      searchFilter,
      selectedWeek,
      weekSpan,
      yearFilter,
    ],
  );

  function incrementSelectedWeek() {
    let date = selectedWeek
      ? DateTime.now().set({
          weekYear: selectedWeek.year,
          weekNumber: selectedWeek.weekNumber,
        })
      : DateTime.now();

    let newDate = date.plus({ week: 1 });
    updateRoute({
      week: { year: newDate.year, weekNumber: newDate.weekNumber },
    });
  }

  function decrementSelectedWeek() {
    let date = selectedWeek
      ? DateTime.now().set({
          weekYear: selectedWeek.year,
          weekNumber: selectedWeek.weekNumber,
        })
      : DateTime.now();

    let newDate = date.plus({ week: -1 });
    updateRoute({
      week: { year: newDate.year, weekNumber: newDate.weekNumber },
    });
  }

  function resetSelectedWeek() {
    router.push(
      `${pathname}?search=${searchFilter}&depFilter=${departmentFilter}&yearFilter=${yearFilter}`,
    );
  }

  function setWeekSpan(weekSpanString: string) {
    const weekSpanNum = parseInt(weekSpanString.split(" ")[0]);
    updateRoute({ numWeeks: weekSpanNum });
  }

  useEffect(() => {
    let nameSearchDebounceTimer = setTimeout(() => {
      if (
        lastSearchKeyStrokeTime &&
        Date.now() - lastSearchKeyStrokeTime > 250
      ) {
        updateRoute({ search: activeNameSearch });
      }
    }, 250);

    // this will clear Timeout
    // when component unmount like in willComponentUnmount
    // and show will not change to true
    return () => {
      clearTimeout(nameSearchDebounceTimer);
    };
  }, [activeNameSearch, lastSearchKeyStrokeTime, updateRoute]);

  const filteredDepartments = departmentFilter
    .split(",")
    .map((id) => departments.find((d) => d.id === id))
    .filter((dept) => dept !== undefined) as Department[];

  const filteredYears = yearFilter
    .split(",")
    .map((urlString) => yearRanges.find((y) => y.urlString === urlString))
    .filter((year) => year !== undefined) as YearRange[];

  const filteredConsultants = filterConsultants(
    searchFilter,
    departmentFilter,
    filteredYears,
    consultants,
  );

  function setNameSearch(newSearch: string) {
    setActiveNameSearch(newSearch);
    setLastSearchKeyStrokeTime(Date.now());
  }

  const toggleDepartmentFilter = useCallback(
    (d: Department) => {
      const newDepartmentFilter = toggleValueFromFilter(departmentFilter, d.id);
      updateRoute({ departments: newDepartmentFilter });
    },
    [departmentFilter, updateRoute],
  );

  const toggleYearFilter = useCallback(
    (y: YearRange) => {
      const newYearFilter = toggleValueFromFilter(yearFilter, y.urlString);
      updateRoute({ years: newYearFilter });
    },
    [updateRoute, yearFilter],
  );

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
        updateRoute({ departments: "" });
      }
    }
    document.addEventListener("keydown", keyDownHandler);

    // clean up
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [updateRoute, departments, toggleDepartmentFilter]);

  return {
    consultants,
    filteredConsultants,
    departments,
    filteredDepartments,
    filteredYears,
    currentNameSearch: activeNameSearch,
    searchFilter,
    setNameSearch,
    toggleDepartmentFilter,
    toggleYearFilter,
    selectedWeek,
    incrementSelectedWeek,
    decrementSelectedWeek,
    resetSelectedWeek,
    weekSpan,
    setWeekSpan,
  };
}

class UrlStringFilter {
  stringFilter: string;
  arrayFilter: string[];
  index: number;
  valueAlreadyExist: boolean;
  value: string;

  constructor(stringFilter: string, value: string) {
    this.stringFilter = stringFilter;
    this.arrayFilter = this.stringFilter.split(",");
    this.index = this.arrayFilter.indexOf(value);
    this.valueAlreadyExist = this.index !== -1;
    this.value = value;
  }

  removeFromFilter() {
    this.arrayFilter.splice(this.index, 1);
    return this.asJoinToString();
  }

  addToFilter() {
    this.arrayFilter.push(this.value);
    return this.asJoinToString();
  }

  asJoinToString() {
    return this.arrayFilter.join(",").replace(/^,/, "");
  }
}

function toggleValueFromFilter(stringFilters: string, value: string) {
  const filter = new UrlStringFilter(stringFilters, value);

  return filter.valueAlreadyExist
    ? filter.removeFromFilter()
    : filter.addToFilter();
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

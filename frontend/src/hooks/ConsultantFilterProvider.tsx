"use client";

import {
  ConsultantReadModel,
  DepartmentReadModel,
  CompetenceReadModel,
  EngagementPerCustomerReadModel,
} from "@/api-types";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { parseYearWeekFromUrlString, weekToString } from "@/data/urlUtils";
import { Week } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const defaultFilters: StaffingFilters = {
  availabilityFilter: false,
  departmentFilter: "",
  competenceFilter: "",
  searchFilter: "",
  selectedWeekFilter: undefined,
  weekSpan: 0,
  rawYearFilter: "",
};

type FilterContextType = {
  consultants: ConsultantReadModel[];
  setConsultants: React.Dispatch<React.SetStateAction<ConsultantReadModel[]>>;
  departments: DepartmentReadModel[];
  competences: CompetenceReadModel[];
  customers: EngagementPerCustomerReadModel[];
  isDisabledHotkeys: boolean;
  setIsDisabledHotkeys: React.Dispatch<React.SetStateAction<boolean>>;
  activeFilters: StaffingFilters;
  updateFilters: UpdateFilters;
};

export const FilteredContext = createContext<FilterContextType>({
  consultants: [],
  setConsultants: () => null,
  departments: [],
  competences: [],
  customers: [],
  isDisabledHotkeys: false,
  setIsDisabledHotkeys: () => {},
  activeFilters: defaultFilters,
  updateFilters: () => null,
});

export function ConsultantFilterProvider(props: {
  consultants: ConsultantReadModel[];
  departments: DepartmentReadModel[];
  competences: CompetenceReadModel[];
  customers: EngagementPerCustomerReadModel[];
  children: ReactNode;
}) {
  const [isDisabledHotkeys, setIsDisabledHotkeys] = useState(false);
  const [consultants, setConsultants] = useState(props.consultants ?? []);
  const [activeFilters, updateFilters] = useUrlRouteFilter();

  useEffect(() => setConsultants(props.consultants), [props.consultants]);

  return (
    <FilteredContext.Provider
      value={{
        ...props,
        isDisabledHotkeys,
        setIsDisabledHotkeys,
        consultants,
        setConsultants,
        activeFilters,
        updateFilters,
      }}
    >
      {props.children}
    </FilteredContext.Provider>
  );
}

interface UpdateFilterParams {
  search?: string;
  departments?: string;
  competences?: string;
  years?: string;
  week?: Week;
  numWeeks?: number;
  availability?: boolean;
}

export type StaffingFilters = {
  availabilityFilter: boolean;
  departmentFilter: string;
  competenceFilter: string;
  rawYearFilter: string;
  selectedWeekFilter: Week | undefined;
  weekSpan: number;
  searchFilter: string;
};

export type UpdateFilters = (updateParams: UpdateFilterParams) => void;

function useUrlRouteFilter(): [StaffingFilters, UpdateFilters] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchFilter, setSearchFilter] = useState(
    searchParams.get("search") || "",
  );
  const [departmentFilter, setDepartmentFilter] = useState(
    searchParams.get("depFilter") || "",
  );
  const [competenceFilter, setCompetenceFilter] = useState(
    searchParams.get("compFilter") || "",
  );
  const [yearFilter, setYearFilter] = useState(
    searchParams.get("yearFilter") || "",
  );
  const [availabilityFilter, setAvailabilityFilter] = useState<boolean>(
    !!searchParams.get("availabilityFilter") || false,
  );
  const [selectedWeek, setSelectedWeek] = useState(
    parseYearWeekFromUrlString(searchParams.get("selectedWeek") || undefined),
  );
  const weekSpan = Number.parseInt(searchParams.get("weekSpan") ?? "8");

  function updateRoute(updateParams: UpdateFilterParams) {
    // If not defined, defaults to current value:
    const { search = searchFilter } = updateParams;
    const { departments = departmentFilter } = updateParams;
    const { competences = competenceFilter } = updateParams;
    const { years = yearFilter } = updateParams;
    const { week = selectedWeek } = updateParams;
    const { numWeeks = weekSpan } = updateParams;
    const { availability = availabilityFilter } = updateParams;

    const url = `${pathname}?search=${search}&depFilter=${departments}&compFilter=${competences}&yearFilter=${years}${
      week ? `&selectedWeek=${weekToString(week)}` : ""
    }&availabilityFilter=${availability}&${
      numWeeks ? `&weekSpan=${numWeeks}` : ""
    }`;

    setYearFilter(years);
    setSearchFilter(search);
    setDepartmentFilter(departments);
    setCompetenceFilter(competences);
    setAvailabilityFilter(availability);
    setSelectedWeek(week);

    if (updateParams.week || updateParams.numWeeks) {
      router.push(url);
    } else {
      window.history.pushState({}, "", url);
    }
  }

  return [
    {
      searchFilter,
      departmentFilter,
      competenceFilter,
      rawYearFilter: yearFilter,
      availabilityFilter,
      selectedWeekFilter: selectedWeek,
      weekSpan,
    },
    updateRoute,
  ];
}

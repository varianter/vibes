"use client";

import {
  DepartmentReadModel,
  CompetenceReadModel,
  ForecastReadModel,
} from "@/api-types";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const defaultFilters: ForecastFilters = {
  availabilityFilter: false,
  departmentFilter: "",
  competenceFilter: "",
  searchFilter: "",
  startDate: "",
  rawYearFilter: "",
  experienceFromFilter: "",
  experienceToFilter: "",
};

export type ForecastContextType = {
  consultants: ForecastReadModel[];
  setConsultants: React.Dispatch<React.SetStateAction<ForecastReadModel[]>>;
  departments: DepartmentReadModel[];
  competences: CompetenceReadModel[];
  isDisabledHotkeys: boolean;
  setIsDisabledHotkeys: React.Dispatch<React.SetStateAction<boolean>>;
  activeFilters: ForecastFilters;
  updateFilters: UpdateFilters;
};

export const FilteredForecastContext = createContext<ForecastContextType>({
  consultants: [],
  setConsultants: () => null,
  departments: [],
  competences: [],
  isDisabledHotkeys: false,
  setIsDisabledHotkeys: () => {},
  activeFilters: defaultFilters,
  updateFilters: () => null,
});

export function ForecastFilterProvider(props: {
  consultants: ForecastReadModel[];
  departments: DepartmentReadModel[];
  competences: CompetenceReadModel[];
  children: ReactNode;
}) {
  const [isDisabledHotkeys, setIsDisabledHotkeys] = useState(false);
  const [consultants, setConsultants] = useState(props.consultants ?? []);
  const [activeFilters, updateFilters] = useUrlRouteFilter();

  useEffect(() => setConsultants(props.consultants), [props.consultants]);

  return (
    <FilteredForecastContext.Provider
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
    </FilteredForecastContext.Provider>
  );
}

interface UpdateFilterParams {
  search?: string;
  departments?: string;
  competences?: string;
  years?: string;
  startDate: string;
  availability?: boolean;
  experienceFrom?: string;
  experienceTo?: string;
}

export type ForecastFilters = {
  availabilityFilter: boolean;
  departmentFilter: string;
  competenceFilter: string;
  rawYearFilter: string;
  startDate: string;
  searchFilter: string;
  experienceFromFilter: string;
  experienceToFilter: string;
};

export type UpdateFilters = (updateParams: UpdateFilterParams) => void;

function useUrlRouteFilter(): [ForecastFilters, UpdateFilters] {
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
  const [experienceFromFilter, setExperienceFromFilter] = useState(
    searchParams.get("experienceFromFilter") || "",
  );
  const [experienceToFilter, setExperienceToFilter] = useState(
    searchParams.get("experienceToFilter") || "",
  );
  const [availabilityFilter, setAvailabilityFilter] = useState<boolean>(
    !!searchParams.get("availabilityFilter") || false,
  );
  const [date, setDate] = useState(searchParams.get("startDate") || "");
  const quarterSpan = Number.parseInt(searchParams.get("quarterSpan") ?? "4");

  function updateRoute(updateParams: UpdateFilterParams) {
    // If not defined, defaults to current value:
    const { search = searchFilter } = updateParams;
    const { departments = departmentFilter } = updateParams;
    const { competences = competenceFilter } = updateParams;
    const { years = yearFilter } = updateParams;
    const { experienceFrom = experienceFromFilter } = updateParams;
    const { experienceTo = experienceToFilter } = updateParams;
    const { startDate = date } = updateParams;
    const { availability = availabilityFilter } = updateParams;

    const url = `${pathname}?search=${search}&depFilter=${departments}&compFilter=${competences}&yearFilter=${years}${`&startDate=${startDate}`}&experienceFromFilter=${experienceFrom}&experienceToFilter=${experienceTo}&availabilityFilter=${availability}`;

    setYearFilter(years);
    setSearchFilter(search);
    setDepartmentFilter(departments);
    setCompetenceFilter(competences);
    setAvailabilityFilter(availability);
    setDate(startDate);
    setExperienceFromFilter(experienceFrom);
    setExperienceToFilter(experienceTo);

    if (updateParams.startDate) {
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
      startDate: date,
      experienceFromFilter,
      experienceToFilter,
    },
    updateRoute,
  ];
}

"use client";

import {
  DepartmentReadModel,
  CompetenceReadModel,
  DisciplineReadModel,
  ConsultantWithForecast,
} from "@/api-types";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const defaultFilters: ForecastFilters = {
  availabilityFilter: false,
  departmentFilter: "",
  competenceFilter: "",
  disciplineFilter: "",
  searchFilter: "",
  startDate: "",
  rawYearFilter: "",
  experienceFromFilter: "",
  experienceToFilter: "",
  monthCount: 12,
};

export type ForecastContextType = {
  consultants: ConsultantWithForecast[];
  setConsultants: React.Dispatch<
    React.SetStateAction<ConsultantWithForecast[]>
  >;
  departments: DepartmentReadModel[];
  competences: CompetenceReadModel[];
  disciplines: DisciplineReadModel[];
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
  disciplines: [],
  isDisabledHotkeys: false,
  setIsDisabledHotkeys: () => {},
  activeFilters: defaultFilters,
  updateFilters: () => null,
});

export function ForecastFilterProvider(props: {
  consultants: ConsultantWithForecast[];
  departments: DepartmentReadModel[];
  competences: CompetenceReadModel[];
  disciplines: DisciplineReadModel[];
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
  disciplines?: string;
  years?: string;
  startDate: string;
  availability?: boolean;
  experienceFrom?: string;
  experienceTo?: string;
  count?: number;
}

export type ForecastFilters = {
  availabilityFilter: boolean;
  departmentFilter: string;
  competenceFilter: string;
  disciplineFilter: string;
  rawYearFilter: string;
  startDate: string;
  searchFilter: string;
  experienceFromFilter: string;
  experienceToFilter: string;
  monthCount: number;
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
  const [disciplineFilter, setDisciplineFilter] = useState(
    searchParams.get("disciplineFilter") || "",
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
    searchParams.get("availabilityFilter") === "true",
  );
  const [date, setDate] = useState(searchParams.get("startDate") || "");
  const [monthCount, setMonthCount] = useState(
    Number.parseInt(searchParams.get("monthCount") ?? "12"),
  );

  function updateRoute(updateParams: UpdateFilterParams) {
    // If not defined, defaults to current value:
    const { search = searchFilter } = updateParams;
    const { departments = departmentFilter } = updateParams;
    const { competences = competenceFilter } = updateParams;
    const { disciplines = disciplineFilter } = updateParams;
    const { years = yearFilter } = updateParams;
    const { experienceFrom = experienceFromFilter } = updateParams;
    const { experienceTo = experienceToFilter } = updateParams;
    const { startDate = date } = updateParams;
    const { availability = availabilityFilter } = updateParams;
    const { count = monthCount } = updateParams;

    const url = `${pathname}?search=${search}&depFilter=${departments}&compFilter=${competences}&disciplineFilter=${disciplines}&yearFilter=${years}&startDate=${startDate}&monthCount=${count}&experienceFromFilter=${experienceFrom}&experienceToFilter=${experienceTo}&availabilityFilter=${availability}`;

    setYearFilter(years);
    setSearchFilter(search);
    setDepartmentFilter(departments);
    setCompetenceFilter(competences);
    setDisciplineFilter(disciplines);
    setAvailabilityFilter(availability);
    setDate(startDate);
    setExperienceFromFilter(experienceFrom);
    setExperienceToFilter(experienceTo);
    setMonthCount(count);

    if (updateParams.startDate || updateParams.count) {
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
      disciplineFilter,
      rawYearFilter: yearFilter,
      availabilityFilter,
      startDate: date,
      experienceFromFilter,
      experienceToFilter,
      monthCount,
    },
    updateRoute,
  ];
}

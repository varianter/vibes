import { YearRange, Consultant } from "@/types";
import { useUrlRouteFilter } from "./useUrlRouteFilter";
import { FilteredContext } from "@/components/FilteredConsultantProvider";
import { useContext } from "react";
import { useYearsXpFilter } from "./useYearsXpFilter";
import { useAvailabilityFilter } from "./useAvailabilityFilter";

export function useConsultantsFilter() {
  const { consultants } = useContext(FilteredContext);

  const { departmentFilter, searchFilter } = useUrlRouteFilter();

  const { filteredYears } = useYearsXpFilter();
  const { availabilityFilterOn } = useAvailabilityFilter();

  const filteredConsultants = filterConsultants(
    searchFilter,
    departmentFilter,
    filteredYears,
    consultants,
    availabilityFilterOn,
  );

  return {
    filteredConsultants,
  };
}

function filterConsultants(
  search: string,
  departmentFilter: string,
  yearFilter: YearRange[],
  consultants: Consultant[],
  availabilityFilterOn: Boolean,
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
  if (availabilityFilterOn) {
    newFilteredConsultants = newFilteredConsultants.filter(
      (consultant) => !consultant.isOccupied,
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

import { YearRange } from "@/types";
import { useCallback, useContext, useEffect, useState } from "react";
import { useRawYearsFilter } from "../staffing/useRawYearFilter";
import { useAvailabilityFilter } from "../staffing/useAvailabilityFilter";
import { usePathname } from "next/navigation";
import { ConsultantWithForecast, SingleConsultantReadModel } from "@/api-types";
import { FilteredForecastContext } from "./ForecastFilterProvider";
import {useOrganizationContext} from "@/context/organization";

export function useSimpleForecastFilter() {
  const { consultants, setConsultants, activeFilters } = useContext(
    FilteredForecastContext,
  );

  const {
    departmentFilter,
    competenceFilter,
    searchFilter,
    experienceFromFilter,
    experienceToFilter,
  } = activeFilters;

  const { filteredYears } = useRawYearsFilter(FilteredForecastContext);
  const { availabilityFilterOn } = useAvailabilityFilter();

  const filteredConsultants = filterConsultants({
    search: searchFilter,
    departmentFilter,
    competenceFilter,
    yearFilter: filteredYears,
    consultants,
    availabilityFilterOn,
    activeExperienceFrom: experienceFromFilter,
    activeExperienceTo: experienceToFilter,
  });

  return {
    filteredConsultants,
    setConsultants,
  };
}

export function useForecastFilter() {
  const { consultants, activeFilters } = useContext(FilteredForecastContext);
  const { currentOrganization } = useOrganizationContext();
  const numWorkHours = currentOrganization?.hoursPerWeek ?? 0;

  const {
    departmentFilter,
    competenceFilter,
    searchFilter,
    experienceFromFilter,
    experienceToFilter,
  } = activeFilters;

  const { filteredYears } = useRawYearsFilter(FilteredForecastContext);
  const { availabilityFilterOn } = useAvailabilityFilter(
    FilteredForecastContext,
  );

  const filteredConsultants = filterConsultants({
    search: searchFilter,
    departmentFilter,
    competenceFilter,
    yearFilter: filteredYears,
    consultants,
    availabilityFilterOn,
    activeExperienceFrom: experienceFromFilter,
    activeExperienceTo: experienceToFilter,
  });

  const { monthlyTotalBillable, monthlyTotalBillableAndOffered } =
    setMonthlyTotalBillable(filteredConsultants);
  const monthlyForecastSums = setMonthlyForecastSum(filteredConsultants);
  const monthlyForecastTotalHours =
    setMonthlyForecastHours(filteredConsultants);
  const weeklyInvoiceRates = setMonthlyInvoiceRate(
    filteredConsultants,
    monthlyTotalBillable,
  );

  return {
    numWorkHours,
    filteredConsultants,
    monthlyTotalBillable,
    monthlyTotalBillableAndOffered,
    weeklyInvoiceRates,
    monthlyForecastSums,
    monthlyForecastTotalHours,
  };
}

export function filterConsultants({
  search,
  departmentFilter,
  competenceFilter,
  yearFilter,
  consultants,
  availabilityFilterOn,
  activeExperienceFrom,
  activeExperienceTo,
}: {
  search: string;
  departmentFilter: string;
  competenceFilter: string;
  yearFilter: YearRange[];
  consultants: ConsultantWithForecast[];
  availabilityFilterOn: boolean;
  activeExperienceFrom: string;
  activeExperienceTo: string;
}) {
  let anyFilterActive = [
    search,
    departmentFilter,
    competenceFilter,
    activeExperienceFrom,
    activeExperienceTo,
    availabilityFilterOn,
  ].some((filter) => filter);
  let newFilteredConsultants = consultants ?? [];

  if (anyFilterActive || yearFilter.length > 0) {
    if (search && search.length > 0) {
      const searchRegex = new RegExp(`(?<!\\p{L})${search}.*\\b`, "giu");

      newFilteredConsultants = newFilteredConsultants.filter((consultant) =>
        searchRegex.test(consultant.consultant.name),
      );
    }
    if (departmentFilter && departmentFilter.length > 0) {
      const departmentFilterSet = new Set(departmentFilter.split(","));
      newFilteredConsultants = newFilteredConsultants.filter((consultant) =>
        departmentFilterSet.has(consultant.consultant.department.id),
      );
    }
    if (competenceFilter && competenceFilter.length > 0) {
      const competenceFilterSet = new Set(
        competenceFilter
          .toLowerCase()
          .split(",")
          .map((c) => c.trim()),
      );

      newFilteredConsultants = newFilteredConsultants.filter((consultant) =>
        consultant.consultant.competences.some((c) =>
          competenceFilterSet.has(c.id.toLowerCase()),
        ),
      );
    }
    if (yearFilter.length > 0) {
      newFilteredConsultants = newFilteredConsultants.filter((consultant) =>
        inYearRanges(consultant, yearFilter),
      );
    }
    if (availabilityFilterOn) {
      newFilteredConsultants = newFilteredConsultants.filter(
        (consultant) => consultant.consultantIsAvailable,
      );
    }
    if (activeExperienceFrom != "" || activeExperienceTo != "") {
      newFilteredConsultants = newFilteredConsultants.filter((consultant) =>
        experienceRange(consultant, activeExperienceFrom, activeExperienceTo),
      );
    }
  }

  return newFilteredConsultants;
}

function experienceRange(
  consultant: ConsultantWithForecast,
  experienceFrom: string,
  experienceTo: string,
) {
  const experienceRange = {
    start: parseInt(experienceFrom),
    end: parseInt(experienceTo),
  };
  let currentConsultant = consultant.consultant;
  if (
    (Number.isNaN(experienceRange.start) ||
      currentConsultant.yearsOfExperience >= experienceRange.start) &&
    (Number.isNaN(experienceRange.end) ||
      currentConsultant.yearsOfExperience <= experienceRange.end)
  )
    return true;
  else {
    return false;
  }
}

function inYearRanges(
  consultant: ConsultantWithForecast,
  yearRanges: YearRange[],
) {
  let currentConsultant = consultant.consultant;
  for (const range of yearRanges) {
    if (
      currentConsultant.yearsOfExperience >= range.start &&
      (!range.end || currentConsultant.yearsOfExperience <= range.end)
    )
      return true;
  }
  return false;
}
interface MonthlyTotal {
  monthlyTotalBillable: Map<number, number>;
  monthlyTotalBillableAndOffered: Map<number, number>;
}

function getMonth(date: string) {
  return new Date(date).getMonth();
}

function setMonthlyForecastSum(
  filteredConsultants: ConsultantWithForecast[],
): Map<number, number> {
  const monthlyForecastSums = new Map<number, number>();

  if (filteredConsultants.length == 0) return monthlyForecastSums;

  filteredConsultants.forEach(({ forecasts }) => {
    forecasts.forEach(({ month, displayedPercentage }) => {
      let monthIndex = getMonth(month);
      monthlyForecastSums.set(
        monthIndex,
        (monthlyForecastSums.get(monthIndex) ?? 0) + displayedPercentage,
      );
    });
  });

  monthlyForecastSums.forEach((value, key) => {
    monthlyForecastSums.set(key, value / filteredConsultants.length);
  });

  return monthlyForecastSums;
}

export function setMonthlyTotalBillable(
  filteredConsultants: ConsultantWithForecast[],
): MonthlyTotal {
  const monthlyTotalBillable = new Map<number, number>();
  const monthlyTotalBillableAndOffered = new Map<number, number>();

  filteredConsultants.forEach((consultant) => {
    consultant.bookings.forEach((booking) => {
      let month = getMonth(booking.month);
      if (monthlyTotalBillable.has(month)) {
        monthlyTotalBillable.set(
          month,
          (monthlyTotalBillable.get(month) ?? 0) +
            booking.bookingModel.totalBillable,
        );
        monthlyTotalBillableAndOffered.set(
          month,
          (monthlyTotalBillableAndOffered.get(month) ?? 0) +
            booking.bookingModel.totalBillable +
            booking.bookingModel.totalOffered,
        );
      } else {
        monthlyTotalBillable.set(month, booking.bookingModel.totalBillable);
        monthlyTotalBillableAndOffered.set(
          month,
          booking.bookingModel.totalBillable +
            booking.bookingModel.totalOffered,
        );
      }
    });
  });

  return {
    monthlyTotalBillable,
    monthlyTotalBillableAndOffered,
  };
}

function setMonthlyForecastHours(filterConsultants: ConsultantWithForecast[]) {
  const monthlyForecastHours = new Map<number, number>();
  filterConsultants.forEach((consultant) => {
    consultant.forecasts.forEach((forecast) => {
      const month = getMonth(forecast.month);
      //hours is billableHours from forecast unless the forecast value has been adjusted, and in that case we calculate it based on the adjusted percentage and salaried hours
      const hours =
        forecast.displayedPercentage == forecast.billablePercentage
          ? forecast.billableHours
          : (forecast.displayedPercentage / 100) * forecast.salariedHours;
      if (monthlyForecastHours.has(month)) {
        const totalHours = monthlyForecastHours.get(month) ?? 0;
        monthlyForecastHours.set(month, totalHours + hours);
      } else {
        monthlyForecastHours.set(month, hours);
      }
    });
  });
  return monthlyForecastHours;
}

function setMonthlyInvoiceRate(
  filteredConsultants: ConsultantWithForecast[],
  monthlyTotalBillable: Map<number, number>,
) {
  const monthlyInvoiceRate = new Map<number, number>();

  monthlyTotalBillable.forEach((totalBillable, month) => {
    let totalAvailableMonthHours = 0;

    filteredConsultants.forEach((consultant) => {
      consultant.forecasts.forEach((forecast) => {
        if (getMonth(forecast.month) === month) {
          totalAvailableMonthHours += forecast.salariedHours;
        }
      });
    });
    const invoiceRate =
      totalAvailableMonthHours <= 0
        ? 0
        : Math.max(0, Math.min(1, totalBillable / totalAvailableMonthHours));
    monthlyInvoiceRate.set(month, invoiceRate);
  });

  return monthlyInvoiceRate;
}

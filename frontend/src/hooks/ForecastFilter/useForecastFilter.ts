import { YearRange } from "@/types";
import { useCallback, useContext, useEffect, useState } from "react";
import { useRawYearsFilter } from "../staffing/useRawYearFilter";
import { useAvailabilityFilter } from "../staffing/useAvailabilityFilter";
import { usePathname } from "next/navigation";
import { ConsultantWithForecast, SingleConsultantReadModel } from "@/api-types";
import { FilteredForecastContext } from "./ForecastFilterProvider";
import { useOrganizationContext } from "@/context/organization";

export function useSimpleForecastFilter() {
  const { consultants, setConsultants, activeFilters } = useContext(
    FilteredForecastContext,
  );

  const {
    departmentFilter,
    competenceFilter,
    disciplineFilter,
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
    disciplineFilter,
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
    disciplineFilter,
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
    disciplineFilter,
    yearFilter: filteredYears,
    consultants,
    availabilityFilterOn,
    activeExperienceFrom: experienceFromFilter,
    activeExperienceTo: experienceToFilter,
  });

  // Billable and offered
  const {
    monthlyTotalBillable,
    monthlyTotalBillableIncome,
    monthlyTotalBillableAndOffered,
    monthlyTotalBillableAndOfferedIncome,
  } = setMonthlyTotalBillable(filteredConsultants);

  // Forecast
  const monthlyForecastSums = setMonthlyForecastSum(filteredConsultants);
  const { monthlyForecastTotalHours, monthlyForecastIncome } =
    setMonthlyForecastHoursAndIncome(filteredConsultants);
  const weeklyInvoiceRates = setMonthlyInvoiceRate(
    filteredConsultants,
    monthlyForecastTotalHours,
  );

  // Total possible
  const { monthlyTotalPossibleHours, monthlyTotalPossibleIncome } =
    setMonthlyTotalPossibleHoursAndIncome(filteredConsultants);

  return {
    numWorkHours,
    filteredConsultants,
    monthlyTotalBillable,
    monthlyTotalBillableIncome,
    monthlyTotalBillableAndOffered,
    monthlyTotalBillableAndOfferedIncome,
    weeklyInvoiceRates,
    monthlyForecastSums,
    monthlyForecastTotalHours,
    monthlyForecastIncome,
    monthlyTotalPossibleHours,
    monthlyTotalPossibleIncome,
  };
}

export function filterConsultants({
  search,
  departmentFilter,
  competenceFilter,
  disciplineFilter,
  yearFilter,
  consultants,
  availabilityFilterOn,
  activeExperienceFrom,
  activeExperienceTo,
}: {
  search: string;
  departmentFilter: string;
  competenceFilter: string;
  disciplineFilter: string;
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
    disciplineFilter,
    activeExperienceFrom,
    activeExperienceTo,
    availabilityFilterOn,
  ].some((filter) => filter);
  let newFilteredConsultants = consultants ?? [];

  if (anyFilterActive || yearFilter.length > 0) {
    if (search && search.length > 0) {
      const searchRegex = new RegExp(`(?<!\\p{L})${search}.*\\b`, "iu");

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
    if (disciplineFilter && disciplineFilter.length > 0) {
      const disciplineFilterSet = new Set(
        disciplineFilter.toLowerCase().split(","),
      );

      newFilteredConsultants = newFilteredConsultants.filter(
        (consultant) =>
          consultant.consultant.discipline &&
          disciplineFilterSet.has(consultant.consultant.discipline.id),
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
) {
  const monthlyBillableHours = new Map<number, number>();
  const monthlyBillableIncome = new Map<number, number>();
  const monthlyBillableAndOfferedHours = new Map<number, number>();
  const monthlyBillableAndOfferedIncome = new Map<number, number>();

  filteredConsultants.forEach((consultant) => {
    const hourlyRate = consultant.consultant.estimatedHourPrice;

    consultant.bookings.forEach((booking) => {
      let month = getMonth(booking.month);

      let billableHours = booking.bookingModel.totalBillable;

      monthlyBillableHours.set(
        month,
        (monthlyBillableHours.get(month) ?? 0) + billableHours,
      );

      monthlyBillableIncome.set(
        month,
        (monthlyBillableIncome.get(month) ?? 0) + billableHours * hourlyRate,
      );

      let billableAndOfferedHours =
        billableHours + booking.bookingModel.totalOffered;

      monthlyBillableAndOfferedHours.set(
        month,
        (monthlyBillableAndOfferedHours.get(month) ?? 0) +
          billableAndOfferedHours,
      );

      monthlyBillableAndOfferedIncome.set(
        month,
        (monthlyBillableAndOfferedIncome.get(month) ?? 0) +
          billableAndOfferedHours * hourlyRate,
      );
    });
  });

  return {
    monthlyTotalBillable: monthlyBillableHours,
    monthlyTotalBillableIncome: monthlyBillableIncome,
    monthlyTotalBillableAndOffered: monthlyBillableAndOfferedHours,
    monthlyTotalBillableAndOfferedIncome: monthlyBillableAndOfferedIncome,
  };
}

function setMonthlyTotalPossibleHoursAndIncome(
  consultants: ConsultantWithForecast[],
) {
  const monthlyTotalPossibleHours = new Map<number, number>();
  const monthlyTotalPossibleIncome = new Map<number, number>();

  consultants.forEach((consultant) => {
    const hourlyRate = consultant.consultant.estimatedHourPrice;

    consultant.forecasts.forEach((forecast) => {
      const month = getMonth(forecast.month);
      const possibleHours = forecast.salariedHours;

      monthlyTotalPossibleHours.set(
        month,
        (monthlyTotalPossibleHours.get(month) ?? 0) + possibleHours,
      );

      monthlyTotalPossibleIncome.set(
        month,
        (monthlyTotalPossibleIncome.get(month) ?? 0) +
          possibleHours * hourlyRate,
      );
    });
  });

  return { monthlyTotalPossibleHours, monthlyTotalPossibleIncome };
}

function setMonthlyForecastHoursAndIncome(
  filterConsultants: ConsultantWithForecast[],
) {
  const monthlyForecastTotalHours = new Map<number, number>();
  const monthlyForecastIncome = new Map<number, number>();

  filterConsultants.forEach((consultant) => {
    const hourlyRate = consultant.consultant.estimatedHourPrice;

    consultant.forecasts.forEach((forecast) => {
      const month = getMonth(forecast.month);

      //hours is billableHours from forecast unless the forecast value has been adjusted, and in that case we calculate it based on the adjusted percentage and salaried hours
      const hours =
        forecast.displayedPercentage == forecast.billablePercentage
          ? forecast.billableHours
          : (forecast.displayedPercentage / 100) * forecast.salariedHours;

      monthlyForecastTotalHours.set(
        month,
        (monthlyForecastTotalHours.get(month) ?? 0) + hours,
      );

      monthlyForecastIncome.set(
        month,
        (monthlyForecastIncome.get(month) ?? 0) + hours * hourlyRate,
      );
    });
  });
  return { monthlyForecastTotalHours, monthlyForecastIncome };
}

function setMonthlyInvoiceRate(
  filteredConsultants: ConsultantWithForecast[],
  monthlyTotalBillableWithForecast: Map<number, number>,
) {
  const monthlyInvoiceRate = new Map<number, number>();

  monthlyTotalBillableWithForecast.forEach((totalBillable, month) => {
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

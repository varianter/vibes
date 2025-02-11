import { YearRange } from "@/types";
import { useCallback, useContext, useEffect, useState } from "react";
import { useRawYearsFilter } from "../staffing/useRawYearFilter";
import { useAvailabilityFilter } from "../staffing/useAvailabilityFilter";
import { usePathname } from "next/navigation";
import { ConsultantWithForecast, SingleConsultantReadModel } from "@/api-types";
import { FilteredForecastContext } from "./ForecastFilterProvider";

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

  const [numWorkHours, setNumWorkHours] = useState<number>(-1);
  const organisationName = usePathname().split("/")[1];

  const fetchNumWorkHours = useCallback(async () => {
    try {
      const data = await fetch(
        `/${organisationName}/bemanning/api/weeklyWorkHours`,
      );
      const numWeeklyHours = await data.json();
      setNumWorkHours(numWeeklyHours || 37.5);
    } catch (e) {
      console.error("Error fetching number of weekly work hours", e);
    }
  }, [organisationName]);

  useEffect(() => {
    fetchNumWorkHours();
  }, [fetchNumWorkHours]);

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
  console.time("filterForecasts");

  const yearFilterOn = yearFilter.length > 0;
  const competenceFilterOn = competenceFilter && competenceFilter.length > 0;
  const departmentFilterOn = departmentFilter && departmentFilter.length > 0;
  const searchFilterOn = search && search.length > 0;
  const experienceFilterOn =
    activeExperienceFrom != "" || activeExperienceTo != "";

  const startExp = parseInt(activeExperienceFrom);
  const endExp = parseInt(activeExperienceTo);
  const departmentFilterSet = new Set(departmentFilter);
  const competenceFilterSet = new Set(
    competenceFilter
      .toLowerCase()
      .split(",")
      .map((c) => c.trim()),
  );

  const searchRegex = searchFilterOn
    ? new RegExp(`(?<!\\p{L})${search}.*\\b`, "giu")
    : null;

  function inYearRanges(
    consultant: SingleConsultantReadModel,
    yearRanges: YearRange[],
  ) {
    return yearRanges.some(
      (range) =>
        consultant.yearsOfExperience >= range.start &&
        (!range.end || consultant.yearsOfExperience <= range.end),
    );
  }

  function experienceRange(
    consultant: ConsultantWithForecast,
    experienceFrom: string,
    experienceTo: string,
  ) {
    const start = parseInt(experienceFrom);
    const end = parseInt(experienceTo);

    return (
      (Number.isNaN(start) ||
        consultant.consultant.yearsOfExperience >= start) &&
      (Number.isNaN(end) || consultant.consultant.yearsOfExperience <= end)
    );
  }

  const newFilteredConsultants = consultants.filter((consultant) => {
    const { consultantIsAvailable, consultant: details } = consultant;

    if (availabilityFilterOn && !consultantIsAvailable) {
      return false;
    }

    if (searchFilterOn && searchRegex && !searchRegex.test(details.name)) {
      return false;
    }

    if (departmentFilterOn && !departmentFilterSet.has(details.department.id)) {
      return false;
    }

    if (experienceFilterOn) {
      const years = details.yearsOfExperience;
      if (
        (!Number.isNaN(startExp) && years < startExp) ||
        (!Number.isNaN(endExp) && years > endExp)
      )
        return false;
    }

    if (
      yearFilterOn &&
      !yearFilter.some(
        ({ start, end }) =>
          details.yearsOfExperience >= start &&
          (!end || details.yearsOfExperience <= end),
      )
    ) {
      return false;
    }

    if (
      competenceFilterOn &&
      !details.competences.some((c) =>
        competenceFilterSet.has(c.id.toLowerCase()),
      )
    ) {
      return false;
    }

    return true;
  });

  console.timeEnd("filterForecasts");

  return newFilteredConsultants;
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

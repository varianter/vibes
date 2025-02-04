import { YearRange } from "@/types";
import { useContext, useEffect, useMemo, useState } from "react";
import { useRawYearsFilter } from "../staffing/useRawYearFilter";
import { useAvailabilityFilter } from "../staffing/useAvailabilityFilter";
import { usePathname } from "next/navigation";
import {
  ConsultantWithForecast,
  ForecastForMonth,
  SingleConsultantReadModel,
} from "@/api-types";
import { FilteredForecastContext } from "./ForecastFilterProvider";

async function getNumWorkHours(
  setNumWorkHours: Function,
  organisationUrlKey: string,
) {
  try {
    const data = await fetch(
      `/${organisationUrlKey}/bemanning/api/weeklyWorkHours`,
      {
        method: "get",
      },
    );
    const numWeeklyHours = await data.json();
    setNumWorkHours(numWeeklyHours || 37.5);
  } catch (e) {
    console.error("Error fetching number of weekly work hours", e);
  }
}

export function useSimpleForecastFilter() {
  const { consultants, setConsultants } = useContext(FilteredForecastContext);

  const {
    departmentFilter,
    competenceFilter,
    searchFilter,
    experienceFromFilter,
    experienceToFilter,
    startDate,
  } = useContext(FilteredForecastContext).activeFilters;

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
  const { consultants } = useContext(FilteredForecastContext);

  const [numWorkHours, setNumWorkHours] = useState<number>(-1);
  const organisationName = usePathname().split("/")[1];

  useEffect(() => {
    getNumWorkHours(setNumWorkHours, organisationName);
  }, [organisationName]);

  const {
    departmentFilter,
    competenceFilter,
    searchFilter,
    experienceFromFilter,
    experienceToFilter,
    startDate,
  } = useContext(FilteredForecastContext).activeFilters;

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
  availabilityFilterOn: Boolean;
  activeExperienceFrom: string;
  activeExperienceTo: string;
}) {
  const newFilteredConsultants: ConsultantWithForecast[] = [];

  function filterCompetence(
    competenceFilter: string,
    consultant: ConsultantWithForecast,
  ) {
    return competenceFilter
      .toLowerCase()
      .split(",")
      .map((c) => c.trim())
      .some((c) =>
        consultant.consultant.competences
          .map((c) => c.id.toLowerCase())
          .includes(c),
      );
  }
  function inYearRanges(
    consultant: SingleConsultantReadModel,
    yearRanges: YearRange[],
  ) {
    for (const range of yearRanges) {
      if (
        consultant.yearsOfExperience >= range.start &&
        (!range.end || consultant.yearsOfExperience <= range.end)
      )
        return true;
    }
    return false;
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
    if (
      (Number.isNaN(experienceRange.start) ||
        consultant.consultant.yearsOfExperience >= experienceRange.start) &&
      (Number.isNaN(experienceRange.end) ||
        consultant.consultant.yearsOfExperience <= experienceRange.end)
    )
      return true;
    else {
      return false;
    }
  }

  consultants.forEach((consultant) => {
    if (
      (availabilityFilterOn && !consultant.consultantIsAvailable) ||
      ((activeExperienceFrom != "" || activeExperienceTo != "") &&
        !experienceRange(
          consultant,
          activeExperienceFrom,
          activeExperienceTo,
        )) ||
      (yearFilter.length > 0 &&
        !inYearRanges(consultant.consultant, yearFilter)) ||
      (competenceFilter &&
        competenceFilter.length > 0 &&
        !filterCompetence(competenceFilter, consultant)) ||
      (departmentFilter &&
        departmentFilter.length > 0 &&
        !departmentFilter.includes(consultant.consultant.department.id)) ||
      (search &&
        search.length > 0 &&
        !consultant.consultant.name.match(
          new RegExp(`(?<!\\p{L})${search}.*\\b`, "giu"),
        ))
    )
      return;

    newFilteredConsultants.push(consultant);
  });

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

  filteredConsultants.forEach((consultant) => {
    consultant.forecasts.forEach((forecast: ForecastForMonth) => {
      let month = getMonth(forecast.month);
      if (monthlyForecastSums.has(month)) {
        const existingSum = monthlyForecastSums.get(month) || 0;
        monthlyForecastSums.set(
          month,
          existingSum + forecast.displayedPercentage,
        );
      } else {
        monthlyForecastSums.set(month, forecast.displayedPercentage);
      }
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
          (monthlyTotalBillable.get(month) || 0) +
            booking.bookingModel.totalBillable,
        );
        monthlyTotalBillableAndOffered.set(
          month,
          (monthlyTotalBillableAndOffered.get(month) || 0) +
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
        const totalHours = monthlyForecastHours.get(month) || 0;
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

import { YearRange } from "@/types";
import { useContext, useEffect, useState } from "react";
import { useRawYearsFilter } from "../staffing/useRawYearFilter";
import { useAvailabilityFilter } from "../staffing/useAvailabilityFilter";
import { usePathname } from "next/navigation";
import { ConsultantWithForecast, SingleConsultantReadModel } from "@/api-types";
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
    console.error("Erro∏r fetching number of weekly work hours", e);
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

  const { weeklyTotalBillable, weeklyTotalBillableAndOffered } =
    setMonthlyTotalBillable(filteredConsultants);

  const weeklyInvoiceRates = setMonthlyInvoiceRate(
    filteredConsultants,
    weeklyTotalBillable,
    numWorkHours,
  );

  return {
    numWorkHours,
    filteredConsultants,
    weeklyTotalBillable,
    weeklyTotalBillableAndOffered,
    weeklyInvoiceRates,
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

interface WeeklyTotal {
  weeklyTotalBillable: Map<number, number>;
  weeklyTotalBillableAndOffered: Map<number, number>;
}

function getMonth(date: string) {
  return new Date(date).getMonth();
}

export function setMonthlyTotalBillable(
  filteredConsultants: ConsultantWithForecast[],
): WeeklyTotal {
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
    weeklyTotalBillable: monthlyTotalBillable,
    weeklyTotalBillableAndOffered: monthlyTotalBillableAndOffered,
  };
}

function setMonthlyInvoiceRate(
  filteredConsultants: ConsultantWithForecast[],
  weeklyTotalBillable: Map<number, number>,
  numWorkHours: number,
) {
  const weeklyInvoiceRate = new Map<number, number>();

  weeklyTotalBillable.forEach((totalBillable, month) => {
    let totalAvailableWeekHours = 0;

    filteredConsultants.forEach((consultant) => {
      consultant.bookings.forEach((booking) => {
        if (getMonth(booking.month) === month) {
          let consultantAvailableWeekHours =
            numWorkHours -
            booking.bookingModel.totalHolidayHours -
            booking.bookingModel.totalExcludableAbsence -
            booking.bookingModel.totalNotStartedOrQuit -
            booking.bookingModel.totalVacationHours;

          totalAvailableWeekHours += consultantAvailableWeekHours;
        }
      });
    });

    const invoiceRate =
      totalAvailableWeekHours <= 0
        ? 0
        : Math.max(0, Math.min(1, totalBillable / totalAvailableWeekHours));
    weeklyInvoiceRate.set(month, invoiceRate);
  });

  return weeklyInvoiceRate;
}

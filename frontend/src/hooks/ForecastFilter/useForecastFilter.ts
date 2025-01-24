import { ConsultantForecastReadModel, YearRange } from "@/types";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { useContext, useEffect, useState } from "react";
import { useRawYearsFilter } from "../staffing/useRawYearFilter";
import { useAvailabilityFilter } from "../staffing/useAvailabilityFilter";
import { usePathname } from "next/navigation";
import { ConsultantReadModel, ProjectWithCustomerModel } from "@/api-types";
import { FilteredForecastContext } from "./ForecastFilterProvider";
import {
  filterAvailable,
  filterCompetence,
  filterDepartment,
  filterExperience,
  filterRawYear,
  filterSearch,
} from "./FilterPredicates";

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

export function useSimpleConsultantsFilter() {
  const { consultants, setConsultants } = useContext(FilteredForecastContext);

  const {
    departmentFilter,
    competenceFilter,
    searchFilter,
    experienceFromFilter,
    experienceToFilter,
    startDate,
  } = useContext(FilteredForecastContext).activeFilters;

  const { filteredYears } = useRawYearsFilter();
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

export function useConsultantsFilter() {
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

  const { filteredYears } = useRawYearsFilter();
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
  consultants: ConsultantForecastReadModel[];
  availabilityFilterOn: Boolean;
  activeExperienceFrom: string;
  activeExperienceTo: string;
}) {
  const newFilteredConsultants = [];

  for (const consultant of consultants) {
    if (availabilityFilterOn && !filterAvailable(consultant)) continue;
    if (!filterExperience(activeExperienceFrom, activeExperienceTo, consultant))
      continue;
    if (!filterRawYear(yearFilter, consultant)) continue;
    if (!filterCompetence(competenceFilter, consultant)) continue;
    if (!filterDepartment(departmentFilter, consultant)) continue;
    if (!filterSearch(search, consultant)) continue;

    newFilteredConsultants.push(consultant);
  }
  return newFilteredConsultants;
}

interface WeeklyTotal {
  weeklyTotalBillable: Map<number, number>;
  weeklyTotalBillableAndOffered: Map<number, number>;
}

export function setMonthlyTotalBillable(
  filteredConsultants: ConsultantForecastReadModel[],
): WeeklyTotal {
  const monthlyTotalBillable = new Map<number, number>();
  const monthlyTotalBillableAndOffered = new Map<number, number>();

  filteredConsultants.forEach((consultant) => {
    consultant.bookings.forEach((booking) => {
      if (monthlyTotalBillable.has(booking.month)) {
        monthlyTotalBillable.set(
          booking.month,
          (monthlyTotalBillable.get(booking.month) || 0) +
            booking.bookingModel.totalBillable,
        );
        monthlyTotalBillableAndOffered.set(
          booking.month,
          (monthlyTotalBillableAndOffered.get(booking.month) || 0) +
            booking.bookingModel.totalBillable +
            booking.bookingModel.totalOffered,
        );
      } else {
        monthlyTotalBillable.set(
          booking.month,
          booking.bookingModel.totalBillable,
        );
        monthlyTotalBillableAndOffered.set(
          booking.month,
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
  filteredConsultants: ConsultantForecastReadModel[],
  weeklyTotalBillable: Map<number, number>,
  numWorkHours: number,
) {
  const weeklyInvoiceRate = new Map<number, number>();

  weeklyTotalBillable.forEach((totalBillable, month) => {
    let totalAvailableWeekHours = 0;

    filteredConsultants.forEach((consultant) => {
      consultant.bookings.forEach((booking) => {
        if (booking.month === month) {
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

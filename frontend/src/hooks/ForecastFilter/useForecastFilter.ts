import { YearRange } from "@/types";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { useContext, useEffect, useState } from "react";
import { useRawYearsFilter } from "../staffing/useRawYearFilter";
import { useAvailabilityFilter } from "../staffing/useAvailabilityFilter";
import { usePathname } from "next/navigation";
import { ConsultantReadModel, ProjectWithCustomerModel } from "@/api-types";
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
  const { consultants } = useContext(FilteredContext);
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
  } = useContext(FilteredContext).activeFilters;

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
    setWeeklyTotalBillable(filteredConsultants);

  const weeklyInvoiceRates = setWeeklyInvoiceRate(
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
  startDate,
}: {
  search: string;
  departmentFilter: string;
  competenceFilter: string;
  yearFilter: YearRange[];
  consultants: ConsultantReadModel[];
  availabilityFilterOn: Boolean;
  activeExperienceFrom: string;
  activeExperienceTo: string;
  startDate: string;
}) {
  let newFilteredConsultants = consultants;
  if (search && search.length > 0) {
    newFilteredConsultants = newFilteredConsultants?.filter((consultant) =>
      consultant.name.match(new RegExp(`(?<!\\p{L})${search}.*\\b`, "giu")),
    );
  }
  if (departmentFilter && departmentFilter.length > 0) {
    newFilteredConsultants = newFilteredConsultants?.filter((consultant) =>
      departmentFilter.includes(consultant.department.id),
    );
  }
  if (competenceFilter && competenceFilter.length > 0) {
    newFilteredConsultants = newFilteredConsultants?.filter((consultant) =>
      competenceFilter
        .toLowerCase()
        .split(",")
        .map((c) => c.trim())
        .some((c) =>
          consultant.competences.map((c) => c.id.toLowerCase()).includes(c),
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
      (consultant) => !consultant.isOccupied,
    );
  }
  if (activeExperienceFrom != "" || activeExperienceTo != "") {
    newFilteredConsultants = newFilteredConsultants.filter((consultant) =>
      experienceRange(consultant, activeExperienceFrom, activeExperienceTo),
    );
  }
  return newFilteredConsultants;
}

function experienceRange(
  consultant: ConsultantReadModel,
  experienceFrom: string,
  experienceTo: string,
) {
  const experienceRange = {
    start: parseInt(experienceFrom),
    end: parseInt(experienceTo),
  };
  if (
    (Number.isNaN(experienceRange.start) ||
      consultant.yearsOfExperience >= experienceRange.start) &&
    (Number.isNaN(experienceRange.end) ||
      consultant.yearsOfExperience <= experienceRange.end)
  )
    return true;
  else {
    return false;
  }
}

function inYearRanges(
  consultant: ConsultantReadModel,
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

interface WeeklyTotal {
  weeklyTotalBillable: Map<number, number>;
  weeklyTotalBillableAndOffered: Map<number, number>;
}

export function setWeeklyTotalBillable(
  filteredConsultants: ConsultantReadModel[],
): WeeklyTotal {
  const weeklyTotalBillable = new Map<number, number>();
  const weeklyTotalBillableAndOffered = new Map<number, number>();

  filteredConsultants.forEach((consultant) => {
    consultant.bookings.forEach((booking) => {
      if (weeklyTotalBillable.has(booking.weekNumber)) {
        weeklyTotalBillable.set(
          booking.weekNumber,
          (weeklyTotalBillable.get(booking.weekNumber) || 0) +
            booking.bookingModel.totalBillable,
        );
        weeklyTotalBillableAndOffered.set(
          booking.weekNumber,
          (weeklyTotalBillableAndOffered.get(booking.weekNumber) || 0) +
            booking.bookingModel.totalBillable +
            booking.bookingModel.totalOffered,
        );
      } else {
        weeklyTotalBillable.set(
          booking.weekNumber,
          booking.bookingModel.totalBillable,
        );
        weeklyTotalBillableAndOffered.set(
          booking.weekNumber,
          booking.bookingModel.totalBillable +
            booking.bookingModel.totalOffered,
        );
      }
    });
  });

  return {
    weeklyTotalBillable,
    weeklyTotalBillableAndOffered,
  };
}

export function setWeeklyTotalBillableForProject(
  selectedConsultants: ConsultantReadModel[],
  project: ProjectWithCustomerModel,
) {
  const weeklyTotalBillableAndOffered = new Map<number, number>();

  selectedConsultants.map((consultant) => {
    const bookingDetail = consultant.detailedBooking.find(
      (booking) => booking.bookingDetails.projectId === project.projectId,
    );

    if (bookingDetail) {
      bookingDetail.hours.map((weeklyHours) => {
        weeklyTotalBillableAndOffered.set(
          weeklyHours.week,
          (weeklyTotalBillableAndOffered.get(weeklyHours.week) || 0) +
            weeklyHours.hours,
        );
      });
    }
  });
  return weeklyTotalBillableAndOffered;
}

function setWeeklyInvoiceRate(
  filteredConsultants: ConsultantReadModel[],
  weeklyTotalBillable: Map<number, number>,
  numWorkHours: number,
) {
  const weeklyInvoiceRate = new Map<number, number>();

  weeklyTotalBillable.forEach((totalBillable, weekNumber) => {
    let totalAvailableWeekHours = 0;

    filteredConsultants.forEach((consultant) => {
      consultant.bookings.forEach((booking) => {
        if (booking.weekNumber === weekNumber) {
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
    weeklyInvoiceRate.set(weekNumber, invoiceRate);
  });

  return weeklyInvoiceRate;
}

import { stringToWeek, weekToString } from "@/data/urlUtils";
import { Week } from "@/types";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface UpdateFilterParams {
  search?: string;
  departments?: string;
  years?: string;
  week?: Week;
  numWeeks?: number;
  availability?: Boolean;
}

export function useUrlRouteFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchFilter = searchParams.get("search") || "";
  const departmentFilter = searchParams.get("depFilter") || "";
  const yearFilter = searchParams.get("yearFilter") || "";
  const availabilityFilter = searchParams.get("availabilityFilter") || "";
  const selectedWeek = stringToWeek(
    searchParams.get("selectedWeek") || undefined,
  );
  const weekSpan = Number.parseInt(searchParams.get("weekSpan") ?? "8");

  const updateRoute = useCallback(
    (updateParams: UpdateFilterParams) => {
      // If not defined, defaults to current value:
      const { search = searchFilter } = updateParams;
      const { departments = departmentFilter } = updateParams;
      const { years = yearFilter } = updateParams;
      const { week = selectedWeek } = updateParams;
      const { numWeeks = weekSpan } = updateParams;
      const { availability = availabilityFilter } = updateParams;

      console.log("Update route with numWeeks = " + numWeeks);

      router.push(
        `${pathname}?search=${search}&depFilter=${departments}&yearFilter=${years}${
          week ? `&selectedWeek=${weekToString(week)}` : ""
        }&availabilityFilter=${availability}&${
          numWeeks ? `&weekSpan=${numWeeks}` : ""
        }`,
      );
    },
    [
      pathname,
      router,
      departmentFilter,
      selectedWeek,
      weekSpan,
      searchFilter,
      yearFilter,
      availabilityFilter,
    ],
  );

  return {
    searchFilter,
    departmentFilter,
    yearFilter,
    availabilityFilter,
    selectedWeekFilter: selectedWeek,
    updateRoute,
    weekSpan,
  };
}

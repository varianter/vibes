"use client";
import DepartmentFilter from "./DepartmentFilter";
import AvailabilityFilter from "./AvailabilityFilter";
import SearchBarComponent from "./SearchBarComponent";
import { ArrowLeft } from "react-feather";
import RawYearsFilter from "./RawYearsFilter";
import CompetenceFilter from "./CompetenceFilter";
import ExperienceFilter from "./ExperienceFilter";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { FilteredForecastContext } from "@/hooks/ForecastFilter/ForecastFilterProvider";

// @ts-ignore
export default function StaffingSidebar({
  isStaffing = true,
  isSidebarOpen,
  closeSidebar,
  isForecast = false,
}: {
  isStaffing?: boolean;
  isSidebarOpen: boolean;
  closeSidebar: () => void;
  isForecast?: boolean;
}) {
  return (
    <>
      {isSidebarOpen && (
        <div className="sidebar z-10 bg-background_grey h-full flex flex-col gap-6 p-4 w-[300px] overflow-y-auto">
          <div className="flex flex-row justify-between items-center">
            <h1 className="">Filter</h1>
            <button
              onClick={closeSidebar}
              className="p-2 text-primary rounded-lg hover:bg-primary hover:bg-opacity-10"
            >
              <ArrowLeft className="text-primary" size="24" />
            </button>
          </div>
          <SearchBarComponent
            context={isForecast ? FilteredForecastContext : FilteredContext}
            placeholder="Søk etter konsulent"
          />
          {isStaffing ? (
            <AvailabilityFilter
              context={isForecast ? FilteredForecastContext : FilteredContext}
            />
          ) : null}
          <DepartmentFilter
            context={isForecast ? FilteredForecastContext : FilteredContext}
          />
          <RawYearsFilter
            context={isForecast ? FilteredForecastContext : FilteredContext}
          />
          <ExperienceFilter
            context={isForecast ? FilteredForecastContext : FilteredContext}
          />
          <CompetenceFilter
            context={isForecast ? FilteredForecastContext : FilteredContext}
          />
        </div>
      )}
      {!isSidebarOpen && (
        <div className="sidebar z-10">
          <SearchBarComponent
            placeholder="Søk etter konsulent"
            context={isForecast ? FilteredForecastContext : FilteredContext}
            hidden={!isSidebarOpen}
          />
        </div>
      )}
    </>
  );
}

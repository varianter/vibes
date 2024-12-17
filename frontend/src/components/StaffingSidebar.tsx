"use client";
import DepartmentFilter from "./DepartmentFilter";
import AvailabilityFilter from "./AvailabilityFilter";
import SearchBarComponent from "./SearchBarComponent";
import { ArrowLeft } from "react-feather";
import RawYearsFilter from "./RawYearsFilter";
import CompetenceFilter from "./CompetenceFilter";
import ExperienceFilter from "./ExperienceFilter";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";

// @ts-ignore
export default function StaffingSidebar({
  isStaffing = true,
  isSidebarOpen,
  closeSidebar,
}: {
  isStaffing?: boolean;
  isSidebarOpen: boolean;
  closeSidebar: () => void;
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
          <SearchBarComponent context={FilteredContext} />
          {isStaffing ? <AvailabilityFilter /> : null}
          <DepartmentFilter />
          <RawYearsFilter />
          <ExperienceFilter />
          <CompetenceFilter />
        </div>
      )}
      {!isSidebarOpen && (
        <div className="sidebar z-10">
          <SearchBarComponent
            context={FilteredContext}
            hidden={!isSidebarOpen}
          />
        </div>
      )}
    </>
  );
}

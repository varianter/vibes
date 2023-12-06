"use client";
import DepartmentFilter from "./DepartmentFilter";
import AvailabilityFilter from "./AvailabilityFilter";
import SearchBarComponent from "./SearchBarComponent";
import { ArrowLeft } from "react-feather";
import ExperienceFilter from "./ExperienceFilter";

// @ts-ignore
export default function StaffingSidebar({
  isSidebarOpen,
  closeSidebar,
}: {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
}) {
  return (
    <div className="sidebar z-10">
      {isSidebarOpen && (
        <div className=" bg-primary/5 h-full flex flex-col gap-6 p-4 w-[300px]">
          <div className="flex flex-row justify-between items-center">
            <h1 className="">Filter</h1>
            <button
              onClick={closeSidebar}
              className="p-2 text-primary rounded-lg hover:bg-primary hover:bg-opacity-10"
            >
              <ArrowLeft className="text-primary" size="24" />
            </button>
          </div>
          <SearchBarComponent />
          <AvailabilityFilter />
          <DepartmentFilter />
          <ExperienceFilter />
        </div>
      )}
      {!isSidebarOpen && <SearchBarComponent hidden={!isSidebarOpen} />}
    </div>
  );
}

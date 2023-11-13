"use client";
import { useState } from "react";
import DepartmentFilter from "./DepartmentFilter";
import AvailabilityFilter from "./AvailabilityFilter";
import SearchBarComponent from "./SearchBarComponent";
import { ArrowLeft, Filter } from "react-feather";
import ExperienceFilter from "./ExperienceFilter";

export default function StaffingSidebar() {
  const [isSidebarHidden, setIsSidebarHidden] = useState(true);

  return (
    <div className="sidebar z-10">
      {!isSidebarHidden ? (
        <div className=" bg-primary_l4 h-full flex flex-col gap-6 p-4 w-[300px]">
          <div className="flex flex-row justify-between items-center">
            <h1 className="">Filter</h1>
            <button
              onClick={() => setIsSidebarHidden(true)}
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
      ) : (
        <>
          <button
            onClick={() => setIsSidebarHidden(false)}
            className="bg-primary/5 rounded-r p-2 mt-16 hover:bg-primary hover:bg-opacity-20"
          >
            <Filter className="text-primary" size="20" />
          </button>
          <div style={{ width: "0px", height: "0px" }}>
            <SearchBarComponent hidden />
          </div>
        </>
      )}
    </div>
  );
}

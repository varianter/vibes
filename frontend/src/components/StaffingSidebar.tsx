"use client";
import { useState } from "react";
import DepartmentFilter from "./DepartmentFilter";
import SearchBarComponent from "./SearchBarComponent";
import { ArrowLeft, Filter } from "react-feather";
import ExperienceFilter from "./ExperienceFilter";

export default function StaffingSidebar() {
  const [isSidebarHidden, setIsSidebarHidden] = useState(true);

  return (
    <div className="min-h-screen fixed">
      <div
        className={`bg-primary_l4 py-6 px-4 h-full min-h-screen w-[211px]  ${
          isSidebarHidden
            ? "absolute -left-[211px]"
            : "fixed sm:sticky top-[52px]"
        }`}
      >
        <div className="flex flex-col gap-6 fixed w-[179px]">
          <div className="flex flex-row justify-between">
            <h3 className="">Filter</h3>
            <button
              onClick={() => setIsSidebarHidden(true)}
              className="rounded p-2 hover:bg-primary_default hover:bg-opacity-20 h-9 w-9"
            >
              <ArrowLeft className="text-primary_default" size="20" />
            </button>
          </div>
          <SearchBarComponent />
          <DepartmentFilter />
          <ExperienceFilter />
        </div>
      </div>
      <button
        onClick={() => setIsSidebarHidden(false)}
        className={`bg-primary_l3 rounded-r p-2 mt-6 hover:bg-primary_default hover:bg-opacity-20 ${
          isSidebarHidden ? "top-[200px]" : "hidden"
        }`}
      >
        <Filter className="text-primary_default" size="20" />
      </button>
    </div>
  );
}

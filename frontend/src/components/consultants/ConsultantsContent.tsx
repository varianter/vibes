"use client";

import StaffingSidebar from "@/components/StaffingSidebar";
import { useState } from "react";
import IconActionButton from "../Buttons/IconActionButton";
import { Filter } from "react-feather";
import ActiveFilters from "../ActiveFilters";
import FilteredConsultants from "./FilteredConsultants";

export default function ConsultantContent() {
  const [isSideBarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <>
      <StaffingSidebar
        isSidebarOpen={isSideBarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />
      <div className="main p-4 pt-5 w-full flex flex-col gap-8">
        <h1>Konsulenter</h1>

        <div className="flex flex-row justify-between items-center pt-[12px]">
          <div className="flex flex-row items-center gap-3">
            <IconActionButton
              variant={"secondary"}
              icon={<Filter />}
              onClick={() => setIsSidebarOpen((wasOpen) => !wasOpen)}
            />
            <ActiveFilters />
          </div>
        </div>
        <FilteredConsultants />
      </div>
    </>
  );
}

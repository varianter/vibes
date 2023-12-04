"use client";

import StaffingSidebar from "@/components/StaffingSidebar";
import FilteredConsultantsList from "@/components/FilteredConsultantsList";
import InfoPillDescriptions from "@/components/InfoPillDescriptions";
import { useState } from "react";
import IconActionButton from "@/components/Buttons/IconActionButton";
import { Filter } from "react-feather";
import ActiveFilters from "@/components/ActiveFilters";
import WeekSelection from "@/components/WeekSelection";

export function StaffingContent() {
  const [isSideBarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <>
      <StaffingSidebar
        isSidebarOpen={isSideBarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <div className="main p-4 w-full flex flex-col gap-8">
        <h1>Bemanning</h1>

        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-3">
            {!isSideBarOpen && (
              <IconActionButton
                variant={"secondary"}
                icon={<Filter />}
                onClick={() => setIsSidebarOpen(true)}
              />
            )}
            <ActiveFilters showIcon={isSideBarOpen} />
          </div>

          <WeekSelection />
        </div>
        <FilteredConsultantsList />
        <InfoPillDescriptions />
      </div>
    </>
  );
}

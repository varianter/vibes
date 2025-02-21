"use client";

import StaffingSidebar from "@/components/StaffingSidebar";
import FilteredConsultantsList from "@/components/FilteredConsultantsList";
import InfoPillDescriptions from "@/components/Staffing/InfoPillDescriptions";
import { Suspense, useState } from "react";
import IconActionButton from "@/components/Buttons/IconActionButton";
import { Filter } from "react-feather";
import ActiveFilters from "@/components/ActiveFilters";
import WeekSelection from "@/components/WeekSelection";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { StaffingSkeleton } from "@/components/Staffing/StaffingSkeleton";
import { DelayRender } from "@/components/DelayRender";

export function StaffingContent() {
  const [isSideBarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <>
      <StaffingSidebar
        isSidebarOpen={isSideBarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <div className="main p-4 pt-5 w-full flex flex-col gap-8">
        <h1>Bemanning</h1>

        <div className="flex flex-row justify-between items-center pt-[12px]">
          <div className="flex flex-row items-center gap-3">
            <IconActionButton
              variant={"secondary"}
              icon={<Filter />}
              onClick={() => setIsSidebarOpen((wasOpen) => !wasOpen)}
            />
            <ActiveFilters />
          </div>

          <WeekSelection />
        </div>

        <Suspense fallback={<StaffingSkeleton />}>
          <FilteredConsultantsList />
        </Suspense>
        <InfoPillDescriptions />
      </div>
    </>
  );
}

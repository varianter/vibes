"use client";

import StaffingSidebar from "@/components/StaffingSidebar";
import InfoPillDescriptions from "@/components/Staffing/InfoPillDescriptions";
import { useState } from "react";
import IconActionButton from "@/components/Buttons/IconActionButton";
import { Filter } from "react-feather";
import ActiveFilters from "@/components/ActiveFilters";
import ForecastTable from "@/components/Forecast/ForecastTable";
import { FilteredForecastContext } from "@/hooks/ForecastFilter/ForecastFilterProvider";
import { ConsultantWithForecast } from "@/api-types";

export function ForecastContent({
  consultants,
}: {
  consultants: ConsultantWithForecast[];
}) {
  const [isSideBarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <>
      <StaffingSidebar
        isSidebarOpen={isSideBarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
        isForecast={true}
      />

      <div className="main p-4 pt-5 w-full flex flex-col gap-8">
        <h1>Prognose</h1>

        <div className="flex flex-row justify-between items-center pt-[12px]">
          <div className="flex flex-row items-center gap-3">
            <IconActionButton
              variant={"secondary"}
              icon={<Filter />}
              onClick={() => setIsSidebarOpen((wasOpen) => !wasOpen)}
            />
            <ActiveFilters context={FilteredForecastContext} />
          </div>
        </div>
        <ForecastTable filteredConsultants={consultants} />
        <InfoPillDescriptions />
      </div>
    </>
  );
}

import {
  CompetenceReadModel,
  ConsultantReadModel,
  DepartmentReadModel,
  EngagementPerCustomerReadModel,
} from "@/api-types";
import { ConsultantFilterProvider } from "@/hooks/ConsultantFilterProvider";
import { parseYearWeekFromUrlString } from "@/data/urlUtils";
import React, { lazy, Suspense } from "react";
import { StaffingContent } from "@/pagecontent/StaffingContent";
import {
  fetchEmployeesWithImageAndToken,
  fetchWithToken,
} from "@/data/apiCallsWithToken";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Bemanning | VIBES",
};

const Staffing = lazy(() => import("./Staffing"));
export default async function Bemanning({
  params,
  searchParams,
}: {
  params: { organisation: string };
  searchParams: { selectedWeek?: string; weekSpan?: string };
}) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center w-[100vw]">
          <div className="loader"></div>
        </div>
      }
    >
      <Staffing params={params} searchParams={searchParams} />
    </Suspense>
  );
}

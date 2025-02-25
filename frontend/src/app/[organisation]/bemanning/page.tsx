import { parseYearWeekFromUrlString } from "@/data/urlUtils";
import React from "react";
import { fetchEmployeesWithImageAndToken } from "@/data/apiCallsWithToken";
import { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Staffing from "./content";

export const metadata: Metadata = {
  title: "Bemanning | VIBES",
};

export default async function Bemanning({
  params,
  searchParams,
}: {
  params: { organisation: string };
  searchParams: { selectedWeek?: string; weekSpan?: string };
}) {
  const weekSpan = searchParams.weekSpan || undefined;
  const selectedWeek = parseYearWeekFromUrlString(
    searchParams.selectedWeek || undefined,
  );
  const organisation = params.organisation;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["consultants", selectedWeek],
    queryFn: () =>
      fetchEmployeesWithImageAndToken(
        `${organisation}/staffings${
          selectedWeek
            ? `?Year=${selectedWeek.year}&Week=${selectedWeek.weekNumber}`
            : ""
        }${weekSpan ? `${selectedWeek ? "&" : "?"}WeekSpan=${weekSpan}` : ""}`,
      ),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Staffing
        weekSpan={weekSpan}
        selectedWeek={selectedWeek}
        organisation={organisation}
      />
    </HydrationBoundary>
  );
}

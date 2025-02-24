"use client";
import {
  CompetenceReadModel,
  DepartmentReadModel,
  EngagementPerCustomerReadModel,
} from "@/api-types";
import {
  fetchEmployeesWithImageAndToken,
  fetchWithToken,
} from "@/data/apiCallsWithToken";
import { ConsultantFilterProvider } from "@/hooks/ConsultantFilterProvider";
import { StaffingContent } from "@/pagecontent/StaffingContent";
import { useQueries } from "@tanstack/react-query";
import { Week } from "@/types";

export default function Staffing({
  selectedWeek,
  weekSpan,
  organisation,
}: {
  selectedWeek: Week | undefined;
  weekSpan: string | undefined;
  organisation: string;
}) {
  const queries = useQueries({
    queries: [
      {
        queryKey: ["consultants", selectedWeek],
        queryFn: () =>
          fetchEmployeesWithImageAndToken(
            `${organisation}/staffings${
              selectedWeek
                ? `?Year=${selectedWeek.year}&Week=${selectedWeek.weekNumber}`
                : ""
            }${
              weekSpan ? `${selectedWeek ? "&" : "?"}WeekSpan=${weekSpan}` : ""
            }`,
          ),
      },
      {
        queryKey: ["departments", organisation],
        queryFn: () =>
          fetchWithToken<DepartmentReadModel[]>(
            `organisations/${organisation}/departments`,
          ),
      },
      {
        queryKey: ["competences", organisation],
        queryFn: () => fetchWithToken<CompetenceReadModel[]>(`competences`),
      },
      {
        queryKey: ["customers", organisation],
        queryFn: () =>
          fetchWithToken<EngagementPerCustomerReadModel[]>(
            `${organisation}/projects`,
          ),
      },
    ],
  });

  const consultants = queries[0].data;
  const departments = queries[1].data;
  const competences = queries[2].data;
  const customers = queries[3].data;

  const isFetching = queries.some((query) => query.isFetching);

  return (
    <ConsultantFilterProvider
      consultants={consultants ?? []}
      departments={departments ?? []}
      competences={competences ?? []}
      customers={customers ?? []}
    >
      <StaffingContent
        weekSpan={weekSpan ? parseInt(weekSpan) : 8}
        isFetching={isFetching}
      />
    </ConsultantFilterProvider>
  );
}

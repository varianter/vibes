import { EditEngagementHour } from "@/components/Staffing/EditEngagementHourModal/EditEngagementHour";
import {
  fetchEmployeesWithImageAndToken,
  fetchWithToken,
} from "@/data/apiCallsWithToken";
import { ProjectWithCustomerModel } from "@/api-types";
import Sidebar from "./Sidebar";
import { ConsultantFilterProvider } from "@/hooks/ConsultantFilterProvider";
import { parseYearWeekFromUrlString } from "@/data/urlUtils";
import { fetchWorkHoursPerWeek } from "@/hooks/fetchWorkHoursPerDay";

export default async function Project({
  params,
  searchParams,
}: {
  params: { organisation: string; project: string };
  searchParams: { selectedWeek?: string; weekSpan?: string };
}) {
  const project =
    (await fetchWithToken<ProjectWithCustomerModel>(
      `${params.organisation}/projects/get/${params.project}`,
    )) ?? undefined;

  const selectedWeek = parseYearWeekFromUrlString(
    searchParams.selectedWeek || undefined,
  );
  const weekSpan = searchParams.weekSpan || undefined;

  const numWorkHours =
    (await fetchWorkHoursPerWeek(params.organisation)) || 37.5;

  const consultants =
    (await fetchEmployeesWithImageAndToken(
      `${params.organisation}/staffings${
        selectedWeek
          ? `?Year=${selectedWeek.year}&Week=${selectedWeek.weekNumber}`
          : ""
      }${weekSpan ? `${selectedWeek ? "&" : "?"}WeekSpan=${weekSpan}` : ""}`,
    )) ?? [];

  if (project) {
    return (
      <ConsultantFilterProvider
        consultants={consultants}
        departments={[]}
        competences={[]}
        customers={[]}
      >
        <Sidebar project={project} />
        <div className="main p-4 pt-5 w-full flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1>{project.projectName}</h1>
            <h2>{project.customerName}</h2>
          </div>

          <EditEngagementHour project={project} numWorkHours={numWorkHours} />
        </div>
      </ConsultantFilterProvider>
    );
  } else {
    return <h1>Fant ikke prosjektet</h1>;
  }
}

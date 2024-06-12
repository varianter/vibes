import { EditEngagementHour } from "@/components/Staffing/EditEngagementHourModal/EditEngagementHour";
import { fetchWithToken } from "@/data/apiCallsWithToken";
import { ProjectWithCustomerModel } from "@/api-types";
import Sidebar from "./Sidebar";

export default async function Project({
  params,
}: {
  params: { organisation: string; project: string };
}) {
  const project =
    (await fetchWithToken<ProjectWithCustomerModel>(
      `${params.organisation}/projects/get/${params.project}`,
    )) ?? undefined;

  if (project) {
    return (
      <>
        <Sidebar project={project} />
        <div className="main p-4 pt-5 w-full flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1>{project.projectName}</h1>
            <h2>{project.customerName}</h2>
          </div>

          <EditEngagementHour project={project} />
        </div>
      </>
    );
  } else {
    return <h1>Fant ikke prosjektet</h1>;
  }
}

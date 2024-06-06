import { ProjectWithCustomerModel } from "@/api-types";
import ChangeEngagementState from "@/components/ChangeEngagementState";
import { EditEngagementHour } from "@/components/Staffing/EditEngagementHourModal/EditEngagementHour";
import { fetchWithToken } from "@/data/apiCallsWithToken";

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
      <div className="main p-4 pt-5 w-full flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1>{project.projectName}</h1>
          <h2>{project.customerName}</h2>
        </div>

        <EditEngagementHour project={project} />
      </div>
    );
  } else {
    return <h1>Fant ikke prosjektet</h1>;
  }
}

import { ProjectWithCustomerModel } from "@/api-types";
import ChangeEngagementState from "@/components/ChangeEngagementState";
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
      <div>
        <h1>{project.projectName}</h1>
        <h2>{project.customerName}</h2>
        <p>{project.bookingType}</p>
        <ChangeEngagementState currentEngagement={project.bookingType} />
      </div>
    );
  } else {
    return <h1>Fant ikke prosjektet</h1>;
  }
}

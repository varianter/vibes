import { ProjectWithCustomerModel } from "@/api-types";
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

  return (
    <div>
      <h1>{project?.projectName}</h1>
      <h2>{project?.customerName}</h2>
    </div>
  );
}

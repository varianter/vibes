import { putWithToken } from "@/data/apiCallsWithToken";
import { updateProjectNameBody } from "@/types";
import { NextResponse } from "next/server";
import { EngagementReadModel } from "@/api-types";

export async function PUT(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const orgUrlKey = params.organisation;
  const requestBody = (await request.json()) as updateProjectNameBody;

  const project =
    (await putWithToken<EngagementReadModel, updateProjectNameBody>(
      `${orgUrlKey}/projects/updateProjectName`,
      requestBody,
    )) ?? [];

  return NextResponse.json(project);
}

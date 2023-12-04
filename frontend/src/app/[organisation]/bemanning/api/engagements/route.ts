import { putWithToken } from "@/data/apiCallsWithToken";
import {
  EngagementBackendBody,
  ProjectWithConsultantsReadModel,
} from "@/types";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const endpointUrl = `${params.organisation}/projects`;
  const requestBody = (await request.json()) as EngagementBackendBody;

  console.log("PUT", request);

  const engagement = await putWithToken<
    ProjectWithConsultantsReadModel,
    EngagementBackendBody
  >(endpointUrl, requestBody);

  return NextResponse.json(engagement);
}

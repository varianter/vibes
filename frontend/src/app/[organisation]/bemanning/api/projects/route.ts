import { putWithToken } from "@/data/apiCallsWithToken";
import { EngagementWriteModel, ProjectWithConsultantsReadModel } from "@/types";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const endpointUrl = `${params.organisation}/projects`;
  const requestBody = (await request.json()) as EngagementWriteModel;

  const engagement = await putWithToken<
    ProjectWithConsultantsReadModel,
    EngagementWriteModel
  >(endpointUrl, requestBody);

  return NextResponse.json(engagement);
}

import { fetchWithToken, putWithToken } from "@/data/apiCallsWithToken";
import { EngagementWriteModel, ProjectWithCustomerModel } from "@/api-types";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const endpointUrl = `${params.organisation}/projects`;
  const requestBody = (await request.json()) as EngagementWriteModel;

  const engagement = await putWithToken<
    ProjectWithCustomerModel,
    EngagementWriteModel
  >(endpointUrl, requestBody);

  return NextResponse.json(engagement);
}

export async function GET(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId") || "";

  const endpointUrl = `${params.organisation}/projects/get/${projectId}`;

  const engagement =
    await fetchWithToken<ProjectWithCustomerModel>(endpointUrl);

  return NextResponse.json(engagement);
}

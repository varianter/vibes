import { putWithToken } from "@/data/apiCallsWithToken";
import { updateProjectStateBody } from "@/types";
import { NextResponse } from "next/server";
import { ConsultantReadModel } from "@/api-types";

export async function PUT(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const orgUrlKey = params.organisation;
  const requestBody = (await request.json()) as updateProjectStateBody;

  const project =
    (await putWithToken<ConsultantReadModel[], updateProjectStateBody>(
      `${orgUrlKey}/projects/updateState`,
      requestBody,
    )) ?? [];

  return NextResponse.json(project);
}

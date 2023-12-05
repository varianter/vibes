import { putWithToken } from "@/data/apiCallsWithToken";
import { Consultant, updateProjectStateBody } from "@/types";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const orgUrlKey = params.organisation;
  const requestBody = (await request.json()) as updateProjectStateBody;

  const project =
    (await putWithToken<Consultant[], updateProjectStateBody>(
      `${orgUrlKey}/projects/updateState`,
      requestBody,
    )) ?? [];

  return NextResponse.json(project);
}

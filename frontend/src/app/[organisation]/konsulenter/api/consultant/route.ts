import { ConsultantReadModel } from "@/api-types";
import { putWithToken } from "@/data/apiCallsWithToken";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const orgUrlKey = params.organisation;
  const requestBody = (await request.json()) as ConsultantReadModel;

  const updatedConsultant =
    (await putWithToken<ConsultantReadModel, ConsultantReadModel>(
      `${orgUrlKey}/consultants`,
      requestBody,
    )) ?? [];

  return NextResponse.json(updatedConsultant);
}

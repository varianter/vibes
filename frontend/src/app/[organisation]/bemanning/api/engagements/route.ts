import { putWithToken } from "@/data/apiCallsWithToken";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const orgUrlKey = params.organisation;

  const engagement =
    (await putWithToken<never, any>(`${orgUrlKey}/projects`, body)) ?? [];

  return NextResponse.json(engagement);
}

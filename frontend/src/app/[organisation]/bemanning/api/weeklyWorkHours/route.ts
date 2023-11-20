import { fetchWithToken } from "@/data/fetchWithToken";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const orgUrlKey = params.organisation;

  const weeklyWorkHours =
    (await fetchWithToken<number>(
      `organisations/${orgUrlKey}/weeklyWorkHours`,
    )) ?? [];

  return NextResponse.json(weeklyWorkHours);
}

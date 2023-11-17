import { fetchWithToken } from "@/data/fetchWithToken";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const organisationName = searchParams.get("organisationName") || "";

  const weeklyWorkHours =
    (await fetchWithToken<number>(
      `organisations/${organisationName}/weeklyWorkHours`,
    )) ?? [];

  return NextResponse.json(weeklyWorkHours);
}

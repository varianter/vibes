import { fetchWithToken } from "@/data/fetchWithToken";
import { Department } from "@/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const organisationName = searchParams.get("organisationName") || "";

  const departments =
    (await fetchWithToken<Department[]>(
      `organisations/${organisationName}/departments`,
    )) ?? [];

  return NextResponse.json(departments);
}

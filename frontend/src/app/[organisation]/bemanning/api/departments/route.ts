import { fetchWithToken } from "@/data/apiCallsWithToken";
import { DepartmentReadModel } from "@/api-types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const organisationName = searchParams.get("organisationName") || "";

  const departments =
    (await fetchWithToken<DepartmentReadModel[]>(
      `organisations/${organisationName}/departments`,
    )) ?? [];

  return NextResponse.json(departments);
}

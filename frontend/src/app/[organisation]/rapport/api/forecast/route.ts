import { fetchWithToken } from "@/data/apiCallsWithToken";
import { ConsultantWithForecast } from "@/api-types";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const { searchParams } = new URL(request.url);
  const query = new URLSearchParams();
  const startDate = searchParams.get("startDate");
  const monthCount = searchParams.get("monthCount");
  if (startDate) query.set("Date", startDate);
  if (monthCount) query.set("MonthCount", monthCount);

  const path = `${params.organisation}/forecasts${
    query.size ? `?${query}` : ""
  }`;

  const data = await fetchWithToken<ConsultantWithForecast[]>(path);

  return NextResponse.json(data ?? []);
}

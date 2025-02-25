import { ConsultantReadModel } from "@/api-types";
import { fetchWithToken } from "@/data/apiCallsWithToken";
import { parseYearWeekFromUrlString } from "@/data/urlUtils";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId") || "";
  const selectedWeekParam = searchParams.get("selectedWeek") || "";
  const selectedWeekSpan = searchParams.get("selectedWeekSpan") || "";
  const isAbsence = searchParams.get("isAbsence") || "";

  const week = parseYearWeekFromUrlString(selectedWeekParam);
  const endpointUrl = `${
    params.organisation
  }/staffings/project/${projectId}?Year=${week?.year}&Week=${week?.weekNumber}&WeekSpan=${selectedWeekSpan}${
    isAbsence ? "&isAbsence=True" : ""
  }`;

  const engagement = await fetchWithToken<ConsultantReadModel[]>(endpointUrl);

  return NextResponse.json(engagement);
}

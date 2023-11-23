import { postWithToken } from "@/data/apiCallsWithToken";
import { parseYearWeekFromString } from "@/data/urlUtils";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const orgUrlKey = params.organisation;
  const { searchParams } = new URL(request.url);
  const consultantID = searchParams.get("consultantID") || "";
  const engagementID = searchParams.get("engagementID") || "";
  const hours = searchParams.get("hours") || "";
  const bookingType = searchParams.get("bookingType") || "";
  const selectedWeek = parseYearWeekFromString(
    searchParams.get("selectedWeek") || undefined,
  );

  const staffing =
    (await postWithToken(
      `${orgUrlKey}/consultants/staffing/new?Hours=${hours}&Type=${bookingType}&ConsultantID=${consultantID}&EngagementID=${engagementID}&${
        selectedWeek
          ? `Year=${selectedWeek.year}&Week=${selectedWeek.weekNumber}`
          : ""
      }`,
    )) ?? [];

  return NextResponse.json(staffing);
}

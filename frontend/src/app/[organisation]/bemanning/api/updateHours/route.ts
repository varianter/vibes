import { putWithToken } from "@/data/apiCallsWithToken";
import { parseYearWeekFromString } from "@/data/urlUtils";
import { StaffingWriteModel } from "@/types";
import { NextResponse } from "next/server";

export async function PUT(
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

  const body: StaffingWriteModel = {
    type: bookingType,
    consultantId: Number(consultantID),
    engagementId: Number(engagementID),
    year: selectedWeek?.year ?? 0,
    week: selectedWeek?.weekNumber ?? 0,
    hours: Number(hours),
  };

  const staffing =
    (await putWithToken<never, StaffingWriteModel>(
      `${orgUrlKey}/consultants/staffing/update`,
      body,
    )) ?? [];

  return NextResponse.json(staffing);
}

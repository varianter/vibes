import { putWithToken } from "@/data/apiCallsWithToken";
import { parseYearWeekFromString } from "@/data/urlUtils";
import { SeveralStaffingWriteModel } from "@/types";
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
  const startWeek = parseYearWeekFromString(
    searchParams.get("startWeek") || undefined,
  );
  const endWeek = parseYearWeekFromString(
    searchParams.get("endWeek") || undefined,
  );

  const body: SeveralStaffingWriteModel = {
    type: bookingType,
    consultantId: Number(consultantID),
    engagementId: Number(engagementID),
    startYear: startWeek?.year ?? 0,
    startWeek: startWeek?.weekNumber ?? 0,
    endYear: endWeek?.year ?? 0,
    endWeek: endWeek?.weekNumber ?? 0,
    hours: Number(hours),
  };

  const staffing =
    (await putWithToken<never, SeveralStaffingWriteModel>(
      `${orgUrlKey}/consultants/staffing/update/several`,
      body,
    )) ?? [];

  return NextResponse.json(staffing);
}

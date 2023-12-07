import { putWithToken } from "@/data/apiCallsWithToken";
import { parseYearWeekFromString } from "@/data/urlUtils";
import { StaffingWriteModel, updateBookingHoursBody } from "@/types";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const orgUrlKey = params.organisation;
  const requestBody = (await request.json()) as updateBookingHoursBody;

  const startWeek = parseYearWeekFromString(
    requestBody.startWeek.toString() || undefined,
  );

  const endWeek = parseYearWeekFromString(
    requestBody.endWeek?.toString() || undefined,
  );

  const body: StaffingWriteModel = {
    type: requestBody.bookingType,
    consultantId: Number(requestBody.consultantId),
    engagementId: Number(requestBody.projectId),
    startYear: startWeek?.year ?? 0,
    startWeek: startWeek?.weekNumber ?? 0,
    endYear: endWeek?.year ?? 0,
    endWeek: endWeek?.weekNumber ?? 0,
    hours: Number(requestBody.hours),
  };

  const url = endWeek
    ? `${orgUrlKey}/consultants/staffing/update/several`
    : `${orgUrlKey}/consultants/staffing/update`;

  const staffing =
    (await putWithToken<never, StaffingWriteModel>(url, body)) ?? [];

  return NextResponse.json(staffing);
}

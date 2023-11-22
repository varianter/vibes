import { putWithToken } from "@/data/fetchWithToken";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { organisation: string; staffingID: string } },
) {
  const orgUrlKey = params.organisation;
  const staffingID = params.staffingID;
  const { searchParams } = new URL(request.url);
  const hours = searchParams.get("hours") || "";
  const bookingType = searchParams.get("bookingType") || "";

  const staffing =
    (await putWithToken(
      `${orgUrlKey}/consultants/staffing/${staffingID}?Hours=${hours}&Type=${bookingType}`,
    )) ?? [];

  return NextResponse.json(staffing);
}

import { postWithToken } from "@/data/fetchWithToken";
import { stringToWeek } from "@/data/urlUtils";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const orgUrlKey = params.organisation;
  const { searchParams } = new URL(request.url);
  const staffingID = searchParams.get("staffingID") || "";
  const hours = searchParams.get("hours") || "";
  const bookingType = searchParams.get("bookingType") || "";

  const staffing = //Skriv put/post with token
    (await postWithToken(
      `${orgUrlKey}/consultants/staffing/${staffingID}?Hours=${hours}&Type${bookingType}`,
    )) ?? [];

  return NextResponse.json(staffing);
}

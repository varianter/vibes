import { postWithToken } from "@/data/fetchWithToken";
import { stringToWeek } from "@/data/urlUtils";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const orgUrlKey = params.organisation;
  const { searchParams } = new URL(request.url);
  const selectedWeek = stringToWeek(
    searchParams.get("selectedWeek") || undefined,
  );
  const weekSpan = searchParams.get("weekSpan") || undefined;
  const staffingID = searchParams.get("staffingID") || "";
  const hours = searchParams.get("hours") || "";
  const bookingType = searchParams.get("bookingType") || "";

  const staffing = //Skriv put/post with token
    (await postWithToken(
      `${orgUrlKey}/consultants/staffing/${staffingID}?Hours=${hours}&Type${bookingType}&${
        selectedWeek
          ? `?Year=${selectedWeek.year}&Week=${selectedWeek.weekNumber}`
          : ""
      }${weekSpan ? `${selectedWeek ? "&" : "?"}WeekSpan=${weekSpan}` : ""}`,
    )) ?? [];

  return NextResponse.json(staffing);
}

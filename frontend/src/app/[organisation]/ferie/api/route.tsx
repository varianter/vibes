import { NextResponse } from "next/server";
import { deleteWithToken, putWithToken } from "@/data/apiCallsWithToken";

interface vacationHoursBody {
  consultantId: number;
  vacationDay: string;
}

export async function PUT(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const orgUrlKey = params.organisation;
  const requestBody = (await request.json()) as vacationHoursBody;

  const url = `${orgUrlKey}/vacations/${requestBody.consultantId}/${requestBody.vacationDay}/update`;

  const vacationDays =
    (await putWithToken<Number, undefined>(url, undefined)) ?? [];

  return NextResponse.json(vacationDays);
}

export async function DELETE(
  request: Request,
  { params }: { params: { organisation: string } },
) {
  const orgUrlKey = params.organisation;
  const requestBody = (await request.json()) as vacationHoursBody;

  const url = `${orgUrlKey}/vacations/${requestBody.consultantId}/${requestBody.vacationDay}/delete`;

  const vacationDays =
    (await deleteWithToken<Number, undefined>(url, undefined)) ?? [];

  return NextResponse.json(vacationDays);
}

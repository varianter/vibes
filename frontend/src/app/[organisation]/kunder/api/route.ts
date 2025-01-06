import { putWithToken } from "@/data/apiCallsWithToken";
import { NextRequest, NextResponse } from "next/server";
export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: { organisation: string };
  },
) {
  const customerId = request.nextUrl.searchParams.get("customerId");
  const activate = request.nextUrl.searchParams.get("activate");
  const endpointUrl = `${params.organisation}/projects/customer/${customerId}/activate?activate=${activate}`;

  const status = await putWithToken(endpointUrl);
  if (status === undefined) {
    return NextResponse.error();
  }

  return new NextResponse();
}

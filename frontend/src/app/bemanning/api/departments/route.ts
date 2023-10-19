import { fetchWithToken } from "@/data/fetchWithToken";
import { Department } from "@/types";
import { NextResponse } from "next/server";

export async function GET() {
  const departments = (await fetchWithToken<Department[]>("departments")) ?? [];
  return NextResponse.json(departments);
}

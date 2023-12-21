"use server";
import { fetchWithToken } from "@/data/apiCallsWithToken";

export async function fetchWorkHoursPerWeek(urlKey: string) {
  return (
    (await fetchWithToken<number>(`organisations/${urlKey}/weeklyWorkHours`)) ??
    undefined
  );
}

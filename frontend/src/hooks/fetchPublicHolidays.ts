"use server";
import { fetchWithToken } from "@/data/apiCallsWithToken";

export async function fetchPublicHolidays(urlKey: string) {
  return (
    (await fetchWithToken<string[]>(`${urlKey}/vacations/publicHolidays`)) ??
    undefined
  );
}

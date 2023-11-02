import { Week } from "@/types";

export function stringToWeek(urlString?: string): Week | undefined {
  if (!urlString) return;
  try {
    const args = urlString.split("-");
    const year = Number.parseInt(args[0]);
    const week = Number.parseInt(args[1]);
    if (year && week) {
      return {
        year: year,
        weekNumber: week,
      };
    }
  } catch {
    return;
  }
}

export function weekToString(week: Week) {
  return `${week.year}-${week.weekNumber}`;
}

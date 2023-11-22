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

export function stringWODashToWeek(urlString?: string): Week | undefined {
  if (!urlString) return;
  try {
    const year = Number.parseInt(urlString.slice(0, 4));
    const week = Number.parseInt(urlString.slice(4));
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

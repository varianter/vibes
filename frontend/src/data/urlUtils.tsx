import { Week } from "@/types";

export function parseYearWeekFromUrlString(
  urlString?: string,
): Week | undefined {
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

export function parseYearWeekFromString(string?: string): Week | undefined {
  if (!string) return;
  try {
    const year = Number.parseInt(string.slice(0, 4));
    const week = Number.parseInt(string.slice(4));
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

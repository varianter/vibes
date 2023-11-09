"use client";
import { DateTime } from "luxon";

export function isCurrentWeek(weekNumber: number, year: number) {
  const today = DateTime.now();
  return today.weekNumber == weekNumber && today.year == year;
}

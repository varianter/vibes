import { DateTime } from "luxon";

export function generateWeekList(
  firstVisibleDay: DateTime,
  numberofWeeks: number,
): DateTime[] | (() => DateTime[]) {
  let numbers = [];
  for (let i = 0; i < numberofWeeks; i++) {
    numbers.push(firstVisibleDay.plus({ weeks: i }));
  }
  return numbers;
}

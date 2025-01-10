import { addDays, isMonday, previousMonday } from "date-fns";

type Week = {
  week: number;
  year: number;
};

export type MonthDistributionOfWeek = {
  week: number;
  year: number;
  month: number;
  secondMonth?: number;
  distribution: number;
};

function weekToWeekType(weekInput: number) {
  const weekInputStr = weekInput.toString();
  return {
    week: Number(weekInputStr.slice(-2)),
    year: Number(weekInputStr.slice(0, 4)),
  } as Week;
}

function getMonthOfWeek(week: Week) {
  const weekNumber = week.week;
  const year = week.year;
  var daysFromStartOfYear = 1 + (weekNumber - 1) * 7;

  const dayOfSelectedWeek = new Date(year, 0, daysFromStartOfYear);
  const mondayOfSelectedWeek = !isMonday(dayOfSelectedWeek)
    ? previousMonday(dayOfSelectedWeek)
    : dayOfSelectedWeek;
  const month = mondayOfSelectedWeek.getMonth();

  var distribution = 100;
  var endDate = null;
  for (let i = 1; i < 5; i++) {
    const addedDayDate = addDays(mondayOfSelectedWeek, i);
    if (addedDayDate.getMonth() != month) {
      distribution = (distribution / 5) * i;
      endDate = addedDayDate;
      break;
    }
  }
  const weekToMonthInstance = {
    week: weekNumber,
    year: year,
    month: month,
    secondMonth: endDate?.getMonth(),
    distribution: distribution,
  } as MonthDistributionOfWeek;

  return weekToMonthInstance;
}

export { weekToWeekType, getMonthOfWeek };

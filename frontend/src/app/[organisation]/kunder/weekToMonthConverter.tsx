import { addDays, isMonday, previousMonday } from "date-fns";

export default async function WeekToMonth() {
  type Week = {
    week: number;
    year: number;
  };

  type MonthDistributionOfWeek = {
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
    for (let i = 1; i < 7; i++) {
      const addedDayDate = addDays(mondayOfSelectedWeek, i);
      if (addedDayDate.getMonth() != month) {
        distribution = (distribution / 7) * i;
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

  const test1 = 202522;
  const test2 = 202505;
  const test3 = 202509;
  const test4 = 202514;
  const tests = [test1, test2, test3, test4];
  const res = tests.map((test) => getMonthOfWeek(weekToWeekType(test)));
  console.log("results are: ", res);
}

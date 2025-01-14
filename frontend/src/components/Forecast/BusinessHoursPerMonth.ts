function getBusinessHoursPerMonth(
  month: number,
  year: number,
  numWorkHours: number,
  publicHolidayDays: string[],
) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const hoursInDay = numWorkHours / 5;
  var businessDaysCount = 0;
  var curDate = firstDay;
  while (curDate <= lastDay) {
    var dayOfWeek = curDate.getDay();
    if (!(dayOfWeek == 6 || dayOfWeek == 0)) {
      if (!isPublicHoliday(curDate, publicHolidayDays)) {
        businessDaysCount++;
      }
    }
    curDate.setDate(curDate.getDate() + 1);
  }
  return businessDaysCount * hoursInDay;
}

function isPublicHoliday(day: Date, publicHolidayDays: string[]) {
  const month = day.getMonth();
  const dayString = `${day.getFullYear().toString()}-${
    month > 8 ? (month + 1).toString() : "0" + (month + 1).toString()
  }-${
    day.getDate() > 9
      ? day.getDate().toString()
      : "0" + day.getDate().toString()
  }`;

  const isHoliday = publicHolidayDays.includes(dayString);
  return isHoliday;
}

export { getBusinessHoursPerMonth };

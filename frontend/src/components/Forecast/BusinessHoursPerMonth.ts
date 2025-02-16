function getBusinessHoursPerMonth(
  dateString: string,
  numWorkHours: number,
  publicHolidayDays: string[],
) {
  const date = new Date(dateString);
  const month = date.getMonth();
  const year = date.getFullYear();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const hoursInDay = numWorkHours / 5;
  var businessDaysCount = 0;
  var currentDate = firstDay;
  while (currentDate <= lastDay) {
    var dayOfWeek = currentDate.getDay();
    if (!(dayOfWeek == 6 || dayOfWeek == 0)) {
      if (!isPublicHoliday(currentDate, publicHolidayDays)) {
        businessDaysCount++;
      }
    }
    currentDate.setDate(currentDate.getDate() + 1);
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

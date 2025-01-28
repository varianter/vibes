export default function getNextMonthNamesWithYear(numberOfMonths: number) {
  var now = new Date();
  var month = now.getMonth();
  var year = now.getFullYear();

  var res = [];
  for (var i = 0; i < numberOfMonths; ++i) {
    res.push({ month: month, year: year });
    if (++month === 12) {
      month = 0;
      ++year;
    }
  }
  return res;
}

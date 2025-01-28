import {
  BookedHoursPerWeek,
  BookingDetails,
  DetailedBooking,
  BookingReadModel,
  BookedHoursInMonth,
} from "@/api-types";
import { getMonthOfWeek, weekToWeekType } from "./WeekToMonthConverter";
import {
  BookedHoursPerMonth,
  MonthlyDetailedBooking,
  MonthlyHours,
} from "@/types";

function round2Decimals(num: number) {
  return Math.round(num * 2) / 2;
}
function transformToMonthlyData(weeklyData: BookedHoursPerWeek[]) {
  const monthlyData: { [key: string]: BookedHoursPerMonth } = {};

  weeklyData.forEach((week) => {
    const { year, weekNumber, bookingModel } = week;
    const monthDistribution = getMonthOfWeek({ week: weekNumber, year: year });
    const primaryMonthKey = `${monthDistribution.year}-${String(
      monthDistribution.month,
    ).padStart(2, "0")}`;
    const secondaryMonthKey =
      monthDistribution.secondMonth !== undefined
        ? `${monthDistribution.year}-${String(
            monthDistribution.secondMonth,
          ).padStart(2, "0")}`
        : null;

    const primaryDistribution = monthDistribution.distribution / 100;
    const secondaryDistribution = secondaryMonthKey
      ? (100 - monthDistribution.distribution) / 100
      : 0;

    function distributeBookingModel(
      distribution: number,
      bookingModel: BookingReadModel,
    ): BookingReadModel {
      const distributedModel: BookingReadModel = { ...bookingModel };
      for (const key of Object.keys(
        bookingModel,
      ) as (keyof BookingReadModel)[]) {
        distributedModel[key] = round2Decimals(
          bookingModel[key] * distribution,
        );
      }
      return distributedModel;
    }

    const primaryBookingModel: BookingReadModel = distributeBookingModel(
      primaryDistribution,
      bookingModel,
    );
    const secondaryBookingModel: BookingReadModel | null = secondaryMonthKey
      ? distributeBookingModel(secondaryDistribution, bookingModel)
      : null;

    function addToMonthlyData(monthKey: string, model: BookingReadModel) {
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          year: year,
          month: parseInt(monthKey.split("-")[1]),
          bookingModel: Object.keys(model).reduce((acc, key) => {
            acc[key as keyof BookingReadModel] = 0;
            return acc;
          }, {} as BookingReadModel),
        };
      }
      for (const key of Object.keys(model) as (keyof BookingReadModel)[]) {
        monthlyData[monthKey].bookingModel[key] += model[key];
      }
    }

    addToMonthlyData(primaryMonthKey, primaryBookingModel);
    if (secondaryMonthKey) {
      addToMonthlyData(secondaryMonthKey, secondaryBookingModel!);
    }
  });
  return Object.values(monthlyData);
}

function bookingForMonth(bookings: BookedHoursInMonth[], month: string) {
  return bookings.find((booking) => booking.month === month);
}

function transformDetailedBookingToMonthlyData(
  weeklyDetails: DetailedBooking[],
) {
  const monthlyData: MonthlyDetailedBooking[] = [];
  function addToMonthlyData(
    hours: MonthlyHours[],
    bookingDetails: BookingDetails,
  ) {
    monthlyData.push({ bookingDetails: bookingDetails, hours: hours });
  }
  weeklyDetails.forEach((detailedBooking) => {
    const { bookingDetails, hours } = detailedBooking;
    const monthlyHours: { [key: string]: MonthlyHours } = {};
    function addToMonthlyHours(
      monthLabel: string,
      hours: number,
      distribution: number,
    ) {
      if (!monthlyHours[monthLabel]) {
        monthlyHours[monthLabel] = {
          month: parseInt(monthLabel),
          hours: 0,
        };
      }
      monthlyHours[monthLabel].hours += round2Decimals(hours * distribution);
    }
    hours.forEach((weekhour) => {
      const { week, hours } = weekhour;
      const weekType = weekToWeekType(week);
      const monthDistribution = getMonthOfWeek(weekType);

      const primaryMonthKey =
        "" +
        monthDistribution.year +
        `${monthDistribution.month < 10 ? "0" : ""}${monthDistribution.month}`;
      const secondaryMonthKey =
        monthDistribution.secondMonth !== undefined
          ? "" +
            monthDistribution.year +
            `${monthDistribution.secondMonth < 10 ? "0" : ""}${
              monthDistribution.secondMonth
            }`
          : null;
      const primaryDistribution = monthDistribution.distribution / 100;
      const secondaryDistribution = secondaryMonthKey
        ? (100 - monthDistribution.distribution) / 100
        : 0;

      addToMonthlyHours(primaryMonthKey, hours, primaryDistribution);
      if (secondaryMonthKey) {
        addToMonthlyHours(secondaryMonthKey, hours, secondaryDistribution);
      }
    });
    addToMonthlyData(Object.values(monthlyHours), bookingDetails);
  });
  return monthlyData;
}
export {
  transformToMonthlyData,
  bookingForMonth,
  transformDetailedBookingToMonthlyData,
};

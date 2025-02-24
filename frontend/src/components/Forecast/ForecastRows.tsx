"use client";

import {
  BookedHoursInMonth,
  ConsultantWithForecast,
  Forecast,
} from "@/api-types";
import React, { useState } from "react";
import { MonthCell } from "./MonthCell";
import Image from "next/image";
import { putWithToken } from "@/data/apiCallsWithToken";
import {
  useForecastFilter,
  useSimpleForecastFilter,
} from "@/hooks/ForecastFilter/useForecastFilter";

function bookingForMonth(bookings: BookedHoursInMonth[], month: string) {
  return bookings.find((booking) => booking.month === month);
}

export default function ForecastRows({
  consultant,
  numWorkHours,
  orgUrlKey,
}: {
  consultant: ConsultantWithForecast;
  numWorkHours: number;
  orgUrlKey: string;
}) {
  const [currentConsultant, setCurrentConsultant] =
    useState<ConsultantWithForecast>(consultant);
  const [hoveredMonth, setHoveredMonth] = useState("");

  const columnCount = consultant.bookings.length ?? 0;

  const bookingsPerMonth = consultant.bookings;

  const { filteredConsultants, setConsultants } = useSimpleForecastFilter();

  async function save(month: string, value: number) {
    await putWithToken<Forecast, Forecast>(`${orgUrlKey}/forecasts/update`, {
      consultantId: consultant.consultant.id,
      month: month,
      adjustedValue: value,
    }).then((res) => {
      if (!res) return;

      // Attempt to locate forecast in consultant, and update value, so that the
      // forecast table sums update accordingly
      const filteredConsultant = filteredConsultants.find(
        (c) => c.consultant.id === consultant.consultant.id,
      );
      if (!filteredConsultant) {
        return;
      }
      const forecast = filteredConsultant.forecasts.find(
        (f) => f.month === month,
      );
      if (!forecast) {
        return;
      }
      forecast.displayedPercentage = res.adjustedValue;
      setConsultants([...filteredConsultants]);
    });
  }

  return (
    <>
      <tr className="h-[52px]">
        <td colSpan={1} className="w-[15%]">
          <div className="flex justify-start gap-1 items-center">
            <div className="flex flex-row justify-center self-center gap-2 w-3/12">
              {consultant.consultant.imageThumbUrl ? (
                <Image
                  src={consultant.consultant.imageThumbUrl}
                  alt={consultant.consultant.name}
                  className="w-10 h-10 rounded-md self-center object-contain"
                  width={32}
                  height={32}
                />
              ) : (
                <div className="w-10 h-10 rounded-md bg-primary"></div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-7/12 ">
              <p
                className={`text-black text-start  normal
                `}
              >
                {currentConsultant.consultant.name}
              </p>
              <p className="xsmall text-black/75 text-start">
                {`${currentConsultant.consultant.yearsOfExperience} års erfaring`}
              </p>
            </div>
          </div>
        </td>
        {currentConsultant.forecasts?.map((b, index) => (
          <MonthCell
            bookedHoursInMonth={bookingForMonth(bookingsPerMonth, b.month)}
            key={index}
            hasBeenEdited={b.displayedPercentage != b.billablePercentage}
            billablePercentage={b.billablePercentage}
            forecastValue={b.displayedPercentage}
            month={b.month}
            consultant={currentConsultant}
            setHoveredMonth={setHoveredMonth}
            hoveredMonth={hoveredMonth}
            columnCount={columnCount}
            isLastCol={index == currentConsultant.bookings.length - 1}
            isSecondLastCol={index == currentConsultant.bookings.length - 2}
            numWorkHours={numWorkHours}
            onChange={(value) => save(b.month, value)}
          />
        ))}
      </tr>
    </>
  );
}

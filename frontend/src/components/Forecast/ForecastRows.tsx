"use client";
import { BookedHoursInMonth, ForecastReadModel } from "@/api-types";
import React, { useState } from "react";
import { MonthCell } from "./MonthCell";

function bookingForMonth(bookings: BookedHoursInMonth[], month: string) {
  const date = new Date(month);

  return bookings.find((booking) => booking.month === month);
}

export default function ForecastRows({
  consultant,
  numWorkHours,
}: {
  consultant: ForecastReadModel;
  numWorkHours: number;
}) {
  const [currentConsultant, setCurrentConsultant] =
    useState<ForecastReadModel>(consultant);
  const [hoveredMonth, setHoveredMonth] = useState("");

  const columnCount = consultant.bookings.length ?? 0;

  const bookingsPerMonth = consultant.bookings;

  return (
    <>
      <tr className="h-[52px]">
        <td>
          <div className="flex justify-start gap-1 items-center">
            <div className="flex flex-row justify-center self-center gap-2 w-3/12">
              <div className="w-10 h-10 rounded-md bg-primary"></div>
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
            hasBeenEdited={
              Math.round(b.displayedPercentage) !=
              Math.round(b.displayedPercentage)
            }
            forecastValue={Math.round(b.displayedPercentage)}
            month={b.month}
            consultant={currentConsultant}
            setHoveredMonth={setHoveredMonth}
            hoveredMonth={hoveredMonth}
            columnCount={columnCount}
            isLastCol={index == currentConsultant.bookings.length - 1}
            isSecondLastCol={index == currentConsultant.bookings.length - 2}
            numWorkHours={numWorkHours}
          />
        ))}
      </tr>
    </>
  );
}

"use client";
import { ForecastReadModel, ProjectWithCustomerModel } from "@/api-types";
import React, { useContext, useEffect, useState } from "react";
import { useModal } from "@/hooks/useModal";
import { usePathname } from "next/navigation";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { MonthCell } from "./MonthCell";
import { bookingForMonth } from "./TransformWeekDataToMonth";
import { FilteredForecastContext } from "@/hooks/ForecastFilter/ForecastFilterProvider";

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

  const columnCount = currentConsultant.bookings.length ?? 0;

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
            bookedHoursPerMonth={bookingForMonth(bookingsPerMonth, b.month)}
            key={index}
            hasBeenEdited={b.displayedPercentage != b.calculatedPercentage}
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

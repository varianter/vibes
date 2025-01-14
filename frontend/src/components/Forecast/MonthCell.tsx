import { ConsultantReadModel } from "@/api-types";
import { BookedHoursPerMonth } from "@/types";
import InfoPill from "@/components/Staffing/InfoPill";
import {
  AlertTriangle,
  Calendar,
  Coffee,
  FileText,
  Moon,
  Sun,
} from "react-feather";
import { getInfopillVariantByColumnCount } from "@/components/Staffing/helpers/utils";
import React from "react";
import { has } from "lodash";
import { HoveredMonth } from "./HoveredMonth";
import ForecastCell from "./ForecastCell";
import RenderInfoPills from "../Staffing/RenderInfoPills";

export function MonthCell(props: {
  bookedHoursPerMonth?: BookedHoursPerMonth;
  forecastValue: number;
  hasBeenEdited: boolean;
  consultant: ConsultantReadModel;
  setHoveredRowWeek: (number: number) => void;
  hoveredRowWeek: number;
  month: number;
  columnCount: number;
  isLastCol: boolean;
  isSecondLastCol: boolean;
  numWorkHours: number;
}) {
  const {
    bookedHoursPerMonth: bookedHoursPerMonth,
    forecastValue,
    consultant,
    hasBeenEdited,
    setHoveredRowWeek,
    hoveredRowWeek,
    month,
    columnCount,
    isLastCol,
    isSecondLastCol,
    numWorkHours,
  } = props;

  const uneditable = forecastValue === 100;
  return (
    <td
      key={month}
      className={`h-[52px] ${isLastCol ? "py-0.5 pl-0.5" : "p-0.5"}`}
    >
      <div
        className={`flex bg-primary/[3%] flex-col gap-1 p-2 justify-end rounded w-full h-full relative border border-transparent hover:border-primary/30 hover:cursor-pointer `}
        onMouseEnter={() => setHoveredRowWeek(month)}
        onMouseLeave={() => setHoveredRowWeek(-1)}
      >
        {hoveredRowWeek != -1 && hoveredRowWeek == month && (
          <HoveredMonth
            hoveredRowMonth={hoveredRowWeek}
            consultant={consultant}
            isLastCol={isLastCol}
            isSecondLastCol={isSecondLastCol}
            columnCount={columnCount}
          />
        )}
        {bookedHoursPerMonth && (
          <RenderInfoPills
            bookedHours={bookedHoursPerMonth}
            columnCount={columnCount}
          />
        )}
        <p
          className={`text-right flex justify-end gap-[0.05rem] ${
            hasBeenEdited ? "normal-medium" : "normal"
          } ${uneditable ? "text-primary/60" : "text-primary"}`}
        >
          {/*  {checkIfNotStartedOrQuit(consultant, bookedHoursPerMonth, numWorkHours)
            ? "-"
            : bookedHoursPerMonth.bookingModel.totalBillable.toLocaleString(
                "nb-No",
              )} */}
          <ForecastCell forecastValue={forecastValue} />
        </p>
      </div>
    </td>
  );
}

function checkIfNotStartedOrQuit(
  consultant: ConsultantReadModel,
  bookedHoursPerMonth: BookedHoursPerMonth,
  numWorkHours: number,
) {
  const notStartedOrQuitHours =
    bookedHoursPerMonth.bookingModel.totalNotStartedOrQuit;

  return (
    notStartedOrQuitHours ==
    numWorkHours - bookedHoursPerMonth.bookingModel.totalHolidayHours
  );
}

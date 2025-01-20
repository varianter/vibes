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
import React, { useState } from "react";
import { has } from "lodash";
import { HoveredMonth } from "./HoveredMonth";
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

  const [forecast, setForecast] = useState(forecastValue);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isChangingHours, setIsChangingHours] = useState(false);

  return (
    <td
      key={month}
      className={`h-[52px] ${isLastCol ? "py-0.5 pl-0.5" : "p-0.5"}`}
    >
      <div
        className={`flex bg-primary/[3%] flex-col gap-1 p-2 justify-end rounded w-full h-full relative border border-transparent hover:border-primary/30 `}
        onMouseEnter={() => {
          setHoveredRowWeek(month);
          setIsChangingHours(true);
        }}
        onMouseLeave={() => {
          setHoveredRowWeek(-1);
          setIsChangingHours(false);
        }}
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

        <div className={`flex flex-row justify-end gap-[0.05rem] `}>
          <input
            type="number"
            min="0"
            step={10}
            value={`${forecast}`}
            draggable={true}
            disabled={forecastValue >= 100}
            onChange={(e) => setForecast(Number(e.target.value))}
            onFocus={(e) => {
              e.target.select();
              setIsInputFocused(true);
            }}
            onBlur={() => {
              setIsInputFocused(false);
            }}
            className={`${
              forecastValue == forecast ? "small" : "small-medium"
            } rounded w-full bg-transparent focus:outline-none min-w-[24px] text-right ${
              uneditable ? "text-primary/60" : "text-primary"
            }`}
          />
          <span
            className={`${
              forecastValue == forecast ? "small" : "small-medium"
            } ${uneditable ? "text-primary/60" : "text-primary"} `}
          >
            %
          </span>
        </div>
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

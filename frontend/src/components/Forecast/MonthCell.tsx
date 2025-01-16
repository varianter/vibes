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
  let pillNumber = 0;

  if (bookedHoursPerMonth) {
    if (bookedHoursPerMonth.bookingModel.totalOffered > 0) {
      pillNumber++;
    }
    if (bookedHoursPerMonth.bookingModel.totalOverbooking > 0) {
      pillNumber++;
    }
    if (bookedHoursPerMonth.bookingModel.totalPlannedAbsences > 0) {
      pillNumber++;
    }
    if (bookedHoursPerMonth.bookingModel.totalVacationHours > 0) {
      pillNumber++;
    }
    if (bookedHoursPerMonth.bookingModel.totalSellableTime > 0) {
      pillNumber++;
    }
  }
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
          <div className="flex flex-row justify-end gap-1">
            {bookedHoursPerMonth.bookingModel.totalOffered > 0 && (
              <InfoPill
                text={bookedHoursPerMonth.bookingModel.totalOffered.toLocaleString(
                  "nb-No",
                  {
                    maximumFractionDigits: 1,
                    minimumFractionDigits: 0,
                  },
                )}
                colors="bg-offer text-primary_darker border-primary_darker"
                icon={<FileText size="12" />}
                variant={getInfopillVariantByColumnCount(columnCount)}
              />
            )}
            {bookedHoursPerMonth.bookingModel.totalSellableTime > 0 &&
              getInfopillVariantByColumnCount(columnCount) !== "narrow" && (
                <InfoPill
                  text={bookedHoursPerMonth.bookingModel.totalSellableTime.toLocaleString(
                    "nb-No",
                    {
                      maximumFractionDigits: 1,
                      minimumFractionDigits: 0,
                    },
                  )}
                  colors="bg-available text-available_darker border-available_darker"
                  icon={<Coffee size="12" />}
                  variant={getInfopillVariantByColumnCount(columnCount)}
                />
              )}
            {bookedHoursPerMonth.bookingModel.totalVacationHours > 0 && (
              <InfoPill
                text={bookedHoursPerMonth.bookingModel.totalVacationHours.toLocaleString(
                  "nb-No",
                  {
                    maximumFractionDigits: 1,
                    minimumFractionDigits: 0,
                  },
                )}
                colors="bg-vacation text-vacation_darker border-vacation_darker"
                icon={<Sun size="12" />}
                variant={getInfopillVariantByColumnCount(columnCount)}
              />
            )}
            {bookedHoursPerMonth.bookingModel.totalPlannedAbsences > 0 &&
              getInfopillVariantByColumnCount(columnCount) !== "narrow" && (
                <InfoPill
                  text={bookedHoursPerMonth.bookingModel.totalPlannedAbsences.toLocaleString(
                    "nb-No",
                    {
                      maximumFractionDigits: 1,
                      minimumFractionDigits: 0,
                    },
                  )}
                  colors="bg-absence text-absence_darker border-absence_darker"
                  icon={<Moon size="12" />}
                  variant={getInfopillVariantByColumnCount(columnCount)}
                />
              )}
            {bookedHoursPerMonth.bookingModel.totalOverbooking > 0 && (
              <InfoPill
                text={bookedHoursPerMonth.bookingModel.totalOverbooking.toLocaleString(
                  "nb-No",
                  {
                    maximumFractionDigits: 1,
                    minimumFractionDigits: 0,
                  },
                )}
                colors="bg-overbooked_darker text-white border-white"
                icon={<AlertTriangle size="12" />}
                variant={getInfopillVariantByColumnCount(columnCount)}
              />
            )}
            {bookedHoursPerMonth.bookingModel.totalNotStartedOrQuit > 0 && (
              <InfoPill
                text={bookedHoursPerMonth.bookingModel.totalNotStartedOrQuit.toLocaleString(
                  "nb-No",
                  {
                    maximumFractionDigits: 1,
                    minimumFractionDigits: 0,
                  },
                )}
                colors="bg-absence/60 text-absence_darker border-absence_darker"
                icon={<Calendar size="12" />}
                variant={getInfopillVariantByColumnCount(columnCount)}
              />
            )}
          </div>
        )}
        <p
          className={`text-right ${
            hasBeenEdited ? "normal-medium" : "normal"
          } ${uneditable ? "text-primary/60" : "text-primary"}`}
        >
          {/*  {checkIfNotStartedOrQuit(consultant, bookedHoursPerMonth, numWorkHours)
            ? "-"
            : bookedHoursPerMonth.bookingModel.totalBillable.toLocaleString(
                "nb-No",
              )} */}
          {`${forecastValue}%`}
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

import { BookedHoursPerWeek, ConsultantReadModel } from "@/api-types";
import { HoveredWeek } from "@/components/Staffing/HoveredWeek";
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

export function MonthCell(props: {
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

  /* let pillNumber = 0;

  if (bookedHoursPerWeek.bookingModel.totalOffered > 0) {
    pillNumber++;
  }
  if (bookedHoursPerWeek.bookingModel.totalOverbooking > 0) {
    pillNumber++;
  }
  if (bookedHoursPerWeek.bookingModel.totalPlannedAbsences > 0) {
    pillNumber++;
  }
  if (bookedHoursPerWeek.bookingModel.totalVacationHours > 0) {
    pillNumber++;
  }
  if (bookedHoursPerWeek.bookingModel.totalSellableTime > 0) {
    pillNumber++;
  } */
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
          <HoveredWeek
            hoveredRowWeek={hoveredRowWeek}
            consultant={consultant}
            isLastCol={isLastCol}
            isSecondLastCol={isSecondLastCol}
            columnCount={columnCount}
          />
        )}
        <div className="flex flex-row justify-end gap-1">
          {/* {bookedHoursPerWeek.bookingModel.totalOffered > 0 && (
            <InfoPill
              text={bookedHoursPerWeek.bookingModel.totalOffered.toLocaleString(
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
          {bookedHoursPerWeek.bookingModel.totalSellableTime > 0 &&
            getInfopillVariantByColumnCount(columnCount) !== "narrow" && (
              <InfoPill
                text={bookedHoursPerWeek.bookingModel.totalSellableTime.toLocaleString(
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
          {bookedHoursPerWeek.bookingModel.totalVacationHours > 0 && (
            <InfoPill
              text={bookedHoursPerWeek.bookingModel.totalVacationHours.toLocaleString(
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
          {bookedHoursPerWeek.bookingModel.totalPlannedAbsences > 0 &&
            getInfopillVariantByColumnCount(columnCount) !== "narrow" && (
              <InfoPill
                text={bookedHoursPerWeek.bookingModel.totalPlannedAbsences.toLocaleString(
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
          {bookedHoursPerWeek.bookingModel.totalOverbooking > 0 && (
            <InfoPill
              text={bookedHoursPerWeek.bookingModel.totalOverbooking.toLocaleString(
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
          {bookedHoursPerWeek.bookingModel.totalNotStartedOrQuit > 0 && (
            <InfoPill
              text={bookedHoursPerWeek.bookingModel.totalNotStartedOrQuit.toLocaleString(
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
          )} */}
        </div>
        <p
          className={`text-right ${
            hasBeenEdited ? "normal-medium" : "normal"
          } ${uneditable ? "text-primary/60" : "text-primary"}`}
        >
          {/*  {checkIfNotStartedOrQuit(consultant, bookedHoursPerWeek, numWorkHours)
            ? "-"
            : bookedHoursPerWeek.bookingModel.totalBillable.toLocaleString(
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
  bookedHoursPerWeek: BookedHoursPerWeek,
  numWorkHours: number,
) {
  const notStartedOrQuitHours =
    bookedHoursPerWeek.bookingModel.totalNotStartedOrQuit;

  return (
    notStartedOrQuitHours ==
    numWorkHours - bookedHoursPerWeek.bookingModel.totalHolidayHours
  );
}

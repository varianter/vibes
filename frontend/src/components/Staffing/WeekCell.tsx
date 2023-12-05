import { BookedHoursPerWeek, Consultant } from "@/types";
import { HoveredWeek } from "@/components/Staffing/HoveredWeek";
import InfoPill from "@/components/Staffing/InfoPill";
import { AlertTriangle, Coffee, FileText, Sun } from "react-feather";
import { getInfopillVariantByColumnCount } from "@/components/Staffing/helpers/utils";
import React from "react";

export function WeekCell(props: {
  bookedHoursPerWeek: BookedHoursPerWeek;
  isListElementVisible: boolean;
  setIsListElementVisible: Function;
  consultant: Consultant;
  setHoveredRowWeek: (number: number) => void;
  hoveredRowWeek: number;
  columnCount: number;
  isLastCol: boolean;
  isSecondLastCol: boolean;
}) {
  const {
    bookedHoursPerWeek: bookedHoursPerWeek,
    isListElementVisible,
    setIsListElementVisible,
    consultant,
    setHoveredRowWeek,
    hoveredRowWeek,
    columnCount,
    isLastCol,
    isSecondLastCol,
  } = props;

  let pillNumber = 0;

  if (bookedHoursPerWeek.bookingModel.totalOffered > 0) {
    pillNumber++;
  }
  if (bookedHoursPerWeek.bookingModel.totalOverbooking > 0) {
    pillNumber++;
  }
  if (bookedHoursPerWeek.bookingModel.totalPlannedAbstences > 0) {
    pillNumber++;
  }
  if (bookedHoursPerWeek.bookingModel.totalVacationHours > 0) {
    pillNumber++;
  }
  if (bookedHoursPerWeek.bookingModel.totalSellableTime > 0) {
    pillNumber++;
  }

  return (
    <td
      key={bookedHoursPerWeek.weekNumber}
      className={`h-[52px] ${isLastCol ? "py-0.5 pl-0.5" : "p-0.5"}`}
    >
      <div
        className={`flex flex-col gap-1 p-2 justify-end rounded w-full h-full relative border border-transparent hover:border-primary/30 hover:cursor-pointer ${
          bookedHoursPerWeek.bookingModel.totalOverbooking > 0
            ? `bg-black text-white`
            : bookedHoursPerWeek.bookingModel.totalSellableTime > 0
            ? `bg-available/50`
            : `bg-primary/[3%]`
        }`}
        onMouseEnter={() => setHoveredRowWeek(bookedHoursPerWeek.weekNumber)}
        onMouseLeave={() => setHoveredRowWeek(-1)}
        onClick={() => setIsListElementVisible(!isListElementVisible)}
      >
        {hoveredRowWeek != -1 &&
          hoveredRowWeek == bookedHoursPerWeek.weekNumber && (
            <HoveredWeek
              hoveredRowWeek={hoveredRowWeek}
              consultant={consultant}
              isLastCol={isLastCol}
              isSecondLastCol={isSecondLastCol}
              columnCount={columnCount}
            />
          )}
        <div className="flex flex-row justify-end gap-1">
          {bookedHoursPerWeek.bookingModel.totalOffered > 0 && (
            <InfoPill
              text={bookedHoursPerWeek.bookingModel.totalOffered.toFixed(1)}
              colors="bg-offer text-primary_darker border-primary_darker"
              icon={<FileText size="12" />}
              variant={getInfopillVariantByColumnCount(columnCount)}
            />
          )}
          {bookedHoursPerWeek.bookingModel.totalSellableTime > 0 &&
            getInfopillVariantByColumnCount(columnCount) !== "narrow" && (
              <InfoPill
                text={bookedHoursPerWeek.bookingModel.totalSellableTime.toFixed(
                  1,
                )}
                colors="bg-available text-available_darker border-available_darker"
                icon={<Coffee size="12" />}
                variant={getInfopillVariantByColumnCount(columnCount)}
              />
            )}
          {bookedHoursPerWeek.bookingModel.totalVacationHours > 0 && (
            <InfoPill
              text={bookedHoursPerWeek.bookingModel.totalVacationHours.toFixed(
                1,
              )}
              colors="bg-vacation text-vacation_darker border-vacation_darker"
              icon={<Sun size="12" />}
              variant={getInfopillVariantByColumnCount(columnCount)}
            />
          )}
          {bookedHoursPerWeek.bookingModel.totalOverbooking > 0 && (
            <InfoPill
              text={bookedHoursPerWeek.bookingModel.totalOverbooking.toFixed(1)}
              colors="bg-overbooked_darker text-white border-white"
              icon={<AlertTriangle size="12" />}
              variant={getInfopillVariantByColumnCount(columnCount)}
            />
          )}
        </div>
        <p
          className={`text-right ${
            isListElementVisible ? "normal-medium" : "normal"
          }`}
        >
          {bookedHoursPerWeek.bookingModel.totalBillable}
        </p>
      </div>
    </td>
  );
}

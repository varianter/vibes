"use client";
import { BookingType, Consultant, DetailedBooking, WeeklyHours } from "@/types";
import React, { useContext, useState, useEffect, useRef } from "react";
import { Minus, Plus } from "react-feather";
import { usePathname } from "next/navigation";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import {
  getColorByStaffingType,
  setDetailedBookingHours,
  upsertConsultantBooking,
} from "./consultantTools";

export function DetailedBookingCell({
  detailedBooking,
  detailedBookingHours,
  consultant,
  hourDragValue,
  setHourDragValue,
  currentDragWeek,
  startDragWeek,
  setStartDragWeek,
  setCurrentDragWeek,
  isRowHovered,
  setIsRowHovered,
}: {
  detailedBooking: DetailedBooking;
  detailedBookingHours: WeeklyHours;
  consultant: Consultant;
  hourDragValue: number | undefined;
  currentDragWeek: number | undefined;
  startDragWeek: number | undefined;
  setHourDragValue: React.Dispatch<React.SetStateAction<number | undefined>>;
  setStartDragWeek: React.Dispatch<React.SetStateAction<number | undefined>>;
  setCurrentDragWeek: React.Dispatch<React.SetStateAction<number | undefined>>;
  isRowHovered: boolean;
  setIsRowHovered: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { setConsultants } = useContext(FilteredContext);
  const [hours, setHours] = useState(detailedBookingHours.hours);
  const [isChangingHours, setIsChangingHours] = useState(false);
  const [oldHours, setOldHours] = useState(detailedBookingHours.hours);
  const { setIsDisabledHotkeys } = useContext(FilteredContext);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const organisationName = usePathname().split("/")[1];
  const numWeeks = detailedBooking.hours.length;

  function updateSingularHours() {
    setIsDisabledHotkeys(false);
    if (oldHours != hours && hourDragValue == undefined) {
      setDetailedBookingHours({
        hours: hours,
        bookingType: detailedBooking.bookingDetails.type,
        organisationUrl: organisationName,
        consultantId: consultant.id,
        bookingId: detailedBooking.bookingDetails.projectId,
        startWeek: detailedBookingHours.week,
      }).then((res) => {
        setConsultants((old) => [
          // Use spread to make a new list, forcing a re-render
          ...upsertConsultantBooking(old, res),
        ]);
      });
    }
  }

  useEffect(() => {
    if (!isRowHovered && inputRef.current) {
      inputRef.current.blur();
    }
  }, [isRowHovered]);

  useEffect(() => {
    setHours(detailedBookingHours.hours);
    setOldHours(detailedBookingHours.hours);
  }, [detailedBookingHours.hours]);

  function updateDragHours() {
    setIsDisabledHotkeys(false);
    if (
      hourDragValue == undefined ||
      startDragWeek == undefined ||
      currentDragWeek == undefined ||
      startDragWeek == currentDragWeek
    ) {
      return;
    }
    setDetailedBookingHours({
      hours: hourDragValue,
      bookingType: detailedBooking.bookingDetails.type,
      organisationUrl: organisationName,
      consultantId: consultant.id,
      bookingId: detailedBooking.bookingDetails.projectId,
      startWeek: startDragWeek,
      endWeek: currentDragWeek,
    }).then((res) => {
      setConsultants((old) => [
        // Use spread to make a new list, forcing a re-render
        ...upsertConsultantBooking(old, res),
      ]);
    });
  }

  function checkIfMarked() {
    if (startDragWeek == undefined || currentDragWeek == undefined)
      return false;
    if (startDragWeek > currentDragWeek) {
      return (
        detailedBookingHours.week >= currentDragWeek &&
        detailedBookingHours.week <= startDragWeek
      );
    }
    return (
      detailedBookingHours.week <= currentDragWeek &&
      detailedBookingHours.week >= startDragWeek
    );
  }

  return (
    <td className="h-8 p-0.5">
      <div
        className={`flex flex-row justify-center items-center rounded px-1 border  ${getColorByStaffingType(
          detailedBooking.bookingDetails.type ?? BookingType.Offer,
        )} ${hours == 0 && "bg-opacity-30"} ${
          isInputFocused || checkIfMarked()
            ? "border-primary"
            : "border-transparent hover:border-primary/30"
        }`}
        onMouseEnter={() => {
          setIsChangingHours(true);
          setIsRowHovered(true);
        }}
        onMouseLeave={() => {
          setIsRowHovered(false);
          setIsChangingHours(false);
          !isInputFocused && updateSingularHours();
        }}
      >
        {isChangingHours &&
          numWeeks <= 12 &&
          detailedBooking.bookingDetails.type != BookingType.Vacation && (
            <button
              tabIndex={-1}
              disabled={hours == 0}
              className={`my-1 p-1 rounded-full ${
                hours > 0 && "hover:bg-primary/10"
              }  hidden ${numWeeks <= 8 && "md:flex"} ${
                numWeeks <= 12 && "lg:flex"
              }  `}
              onClick={() => {
                setHours(Math.max(hours - 7.5, 0));
              }}
            >
              <Minus
                className={`w-4 h-4 text-primary ${
                  hours == 0 && "text-primary/50"
                }`}
              />
            </button>
          )}

        <input
          ref={inputRef}
          type="number"
          min="0"
          step="7.5"
          value={hours}
          draggable={true}
          disabled={detailedBooking.bookingDetails.type == BookingType.Vacation}
          onChange={(e) =>
            hourDragValue == undefined && setHours(Number(e.target.value))
          }
          onFocus={(e) => {
            e.target.select();
            setIsInputFocused(true);
            setIsDisabledHotkeys(true);
          }}
          onBlur={() => {
            updateSingularHours();
            setIsInputFocused(false);
            setIsDisabledHotkeys(false);
          }}
          onDragStart={() => {
            setHourDragValue(hours),
              setStartDragWeek(detailedBookingHours.week);
          }}
          onDragEnterCapture={() =>
            setCurrentDragWeek(detailedBookingHours.week)
          }
          onDragEnd={() => {
            updateDragHours();
            setHourDragValue(undefined);
            setCurrentDragWeek(undefined);
            setStartDragWeek(undefined);
          }}
          className={`small-medium rounded w-full py-2 bg-transparent focus:outline-none min-w-[24px] ${
            isChangingHours && numWeeks <= 12 ? "text-center" : "text-right"
          } ${hours == 0 && "text-black/75"} `}
        ></input>
        {isChangingHours &&
          numWeeks <= 12 &&
          detailedBooking.bookingDetails.type != BookingType.Vacation && (
            <button
              tabIndex={-1}
              className={`my-1 p-1 rounded-full hover:bg-primary/10 hidden ${
                numWeeks <= 8 && "md:flex"
              } ${numWeeks <= 12 && "lg:flex"} `}
              onClick={() => {
                setHours(hours + 7.5);
              }}
            >
              <Plus className="w-4 h-4 text-primary" />
            </button>
          )}
      </div>
    </td>
  );
}

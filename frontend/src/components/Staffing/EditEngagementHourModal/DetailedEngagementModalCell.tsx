import {
  ProjectWithCustomerModel,
  ConsultantReadModel,
  BookingType,
} from "@/api-types";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { DateTime } from "luxon";
import { usePathname } from "next/navigation";
import { useState, useContext, useRef, useEffect } from "react";
import { Minus, Plus } from "react-feather";
import { setDetailedBookingHours } from "../DetailedBookingRows";
import { getColorByStaffingType } from "../helpers/utils";
import { getBookingTypeFromProjectState, dayToWeek } from "./utils";

export function DetailedEngagementModalCell({
  project,
  consultant,
  hourDragValue,
  setHourDragValue,
  currentDragWeek,
  startDragWeek,
  setStartDragWeek,
  setCurrentDragWeek,
  numWeeks,
  firstDayInWeek,
  initHours,
  updateHours,
  numWorkHours,
}: {
  project?: ProjectWithCustomerModel;
  consultant: ConsultantReadModel;
  hourDragValue: number | undefined;
  currentDragWeek: number | undefined;
  startDragWeek: number | undefined;
  setHourDragValue: React.Dispatch<React.SetStateAction<number | undefined>>;
  setStartDragWeek: React.Dispatch<React.SetStateAction<number | undefined>>;
  setCurrentDragWeek: React.Dispatch<React.SetStateAction<number | undefined>>;
  numWeeks: number;
  firstDayInWeek: DateTime;
  initHours: number;
  updateHours: (res: ConsultantReadModel | undefined) => void;
  numWorkHours: number;
}) {
  const [hours, setHours] = useState(initHours);
  const [isChangingHours, setIsChangingHours] = useState(false);
  const [oldHours, setOldHours] = useState(0);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const organisationName = usePathname().split("/")[1];

  const workHoursPerDay = numWorkHours / 5;

  function updateSingularHours() {
    if (oldHours != hours && hourDragValue == undefined) {
      setOldHours(hours);
      setDetailedBookingHours({
        hours: hours,
        bookingType: getBookingTypeFromProjectState(project?.bookingType),
        organisationUrl: organisationName,
        consultantId: consultant.id,
        bookingId: `${project?.projectId}`,
        startWeek: dayToWeek(firstDayInWeek),
      }).then((res) => {
        updateHours(res);
      });
    }
  }

  function updateDragHours() {
    if (
      hourDragValue == undefined ||
      startDragWeek == undefined ||
      currentDragWeek == undefined ||
      startDragWeek == currentDragWeek
    ) {
      return;
    }
    setOldHours(hours);
    setDetailedBookingHours({
      hours: hourDragValue,
      bookingType: getBookingTypeFromProjectState(project?.bookingType),
      organisationUrl: organisationName,
      consultantId: consultant.id,
      bookingId: `${project?.projectId}`,
      startWeek: startDragWeek,
      endWeek: currentDragWeek,
    }).then((res) => {
      updateHours(res);
    });
  }

  useEffect(() => {
    setHours(initHours);
    setOldHours(initHours);
  }, [initHours]);

  function checkIfMarked() {
    if (startDragWeek == undefined || currentDragWeek == undefined)
      return false;
    if (startDragWeek > currentDragWeek) {
      return (
        dayToWeek(firstDayInWeek) >= currentDragWeek &&
        dayToWeek(firstDayInWeek) <= startDragWeek
      );
    }
    return (
      dayToWeek(firstDayInWeek) <= currentDragWeek &&
      dayToWeek(firstDayInWeek) >= startDragWeek
    );
  }

  return (
    <td className="h-8 p-0.5">
      <div
        className={`flex justify-end items-center border rounded-lg h-full ${
          hours == 0 && "bg-opacity-30"
        } ${getColorByStaffingType(
          getBookingTypeFromProjectState(project?.bookingType) ??
            BookingType.Offer,
        )} ${
          isInputFocused || checkIfMarked()
            ? "border-primary"
            : "border-transparent hover:border-primary/30"
        }`}
        onMouseEnter={() => {
          setIsChangingHours(true);
        }}
        onMouseLeave={() => {
          setIsChangingHours(false);
          !isInputFocused && updateSingularHours();
        }}
      >
        {isChangingHours && numWeeks <= 12 && (
          <button
            tabIndex={-1}
            disabled={hours == 0}
            className={`my-1 p-1 rounded-full ${
              hours > 0 && "hover:bg-primary/10"
            }  hidden ${numWeeks <= 8 && "md:flex"} ${
              numWeeks <= 12 && "lg:flex"
            }  `}
            onClick={() => {
              setHours(Math.max(hours - workHoursPerDay, 0));
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
          step={workHoursPerDay}
          value={hours}
          draggable={true}
          onChange={(e) =>
            hourDragValue == undefined && setHours(Number(e.target.value))
          }
          onFocus={(e) => {
            e.target.select();
            setIsInputFocused(true);
          }}
          onBlur={() => {
            updateSingularHours();
            setIsInputFocused(false);
          }}
          onDragStart={() => {
            setHourDragValue(hours);
            setStartDragWeek(dayToWeek(firstDayInWeek));
          }}
          onDragEnterCapture={() => {
            setCurrentDragWeek(dayToWeek(firstDayInWeek));
          }}
          onDragEnd={() => {
            updateDragHours();
            setHourDragValue(undefined);
            setCurrentDragWeek(undefined);
            setStartDragWeek(undefined);
          }}
          className={`small-medium rounded w-full p-2 bg-transparent focus:outline-none min-w-[24px] ${
            isChangingHours && numWeeks <= 12 ? "text-center" : "text-right"
          } ${hours == 0 && "text-black/75"} `}
        ></input>
        {isChangingHours && numWeeks <= 12 && (
          <button
            tabIndex={-1}
            className={`my-1 p-1 rounded-full hover:bg-primary/10 hidden ${
              numWeeks <= 8 && "md:flex"
            } ${numWeeks <= 12 && "lg:flex"} `}
            onClick={() => {
              setHours(hours + workHoursPerDay);
            }}
          >
            <Plus className="w-4 h-4 text-primary" />
          </button>
        )}
      </div>
    </td>
  );
}

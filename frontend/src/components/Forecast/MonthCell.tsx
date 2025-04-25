import { BookedHoursInMonth, ConsultantWithForecast } from "@/api-types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { HoveredMonth } from "./HoveredMonth";
import RenderInfoPills from "../Staffing/RenderInfoPills";
import { useOnClickOutside } from "usehooks-ts";

type Props = {
  bookedHoursInMonth?: BookedHoursInMonth;
  forecastValue: number;
  billablePercentage: number;
  hasBeenEdited: boolean;
  consultant: ConsultantWithForecast;
  setHoveredMonth: (date: string) => void;
  hoveredMonth: string;
  month: string;
  columnCount: number;
  isLastCol: boolean;
  isSecondLastCol: boolean;
  numWorkHours: number;
  setPercentageDragValue: (value: number | undefined) => void;
  setStartDragMonth: (value: string | undefined) => void;
  setCurrentDragMonth: (value: string | undefined) => void;
  saveMany: (
    startMonth: string,
    endMonth: string,
    value: number,
  ) => Promise<void>;
  percentageDragValue?: number;
  startDragMonth?: string;
  currentDragMonth?: string;
  onChange?: (value: number) => void;
};

export function MonthCell({
  bookedHoursInMonth,
  forecastValue,
  billablePercentage,
  consultant,
  hasBeenEdited,
  setHoveredMonth: setHoveredMonth,
  hoveredMonth: hoveredMonth,
  month,
  columnCount,
  isLastCol,
  isSecondLastCol,
  numWorkHours,
  setPercentageDragValue,
  percentageDragValue,
  setStartDragMonth,
  startDragMonth,
  setCurrentDragMonth,
  currentDragMonth,
  saveMany,

  ...props
}: Props) {
  const uneditable = billablePercentage === 100;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [storedValue, setStoredValue] = useState<number>(forecastValue);
  const [inputValue, setInputValue] = useState<number>(forecastValue);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    setInputValue(forecastValue);
    setStoredValue(forecastValue);
  }, [forecastValue]);

  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef(null);

  function handleClickOutside() {
    setDropdownOpen(false);
  }

  useOnClickOutside(ref, handleClickOutside);

  const hasFreeTime = bookedHoursInMonth?.bookingModel?.totalSellableTime! > 0;

  const options = useMemo(() => {
    const allOptions = [50, 80, 100];
    return allOptions.filter((option) => option >= billablePercentage);
  }, [billablePercentage]);

  function onChange(value: number) {
    // If values match, there's been no changes
    if (storedValue === value) return;
    props.onChange?.(value);
    setStoredValue(value);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(parseInt(e.target.value));
    setHighlightedIndex(-1);
  }

  function validateInput() {
    if (inputValue < billablePercentage) {
      alert(
        `Du kan ikke legge inn en prognose som er lavere enn bemanningen (${billablePercentage}%)`,
      );
      setInputValue(forecastValue);
      return false;
    }
    if (inputValue > 100) {
      alert("Du kan ikke legge inn en prognose som er høyere enn 100%");
      setInputValue(forecastValue);
      return false;
    }
    return true;
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "ArrowUp":
        if (!dropdownOpen) break;
        e.preventDefault();
        setHighlightedIndex(
          (prevIndex) => (prevIndex - 1 + options.length) % options.length,
        );
        break;
      case "ArrowDown":
        if (!dropdownOpen) break;
        e.preventDefault();
        setHighlightedIndex((prevIndex) => (prevIndex + 1) % options.length);
        break;
      case "Escape":
        e.preventDefault();
        if (dropdownOpen) {
          setDropdownOpen(false);
        }
        setInputValue(forecastValue);
        // delay blur just a tiny bit to avoid any potential alerts about invalid value (which we discarded above anyway)
        setTimeout(() => inputRef.current?.blur(), 5);
        break;
      case "Enter":
        e.preventDefault();
        if (dropdownOpen && highlightedIndex >= 0) {
          setInputValue(options[highlightedIndex]);
          onChange(options[highlightedIndex]);
        } else {
          onChange(inputValue);
        }
        inputRef.current?.blur();
        setDropdownOpen(false);
        break;
      case "Tab":
        setDropdownOpen(false);
        break;
    }
  }

  function handleOptionClick(option: number) {
    setInputValue(option);
    setDropdownOpen(false);
    onChange(option);
  }

  function handleOnFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.target.select();
  }

  function handleOnBlur(e: React.FocusEvent<HTMLInputElement>) {
    if (!validateInput()) return;
    !dropdownOpen && onChange(inputValue);
  }

  function checkIfMarked() {
    if (startDragMonth == undefined || currentDragMonth == undefined) {
      return false;
    }

    const startDragMonthIndex = consultant.bookings.findIndex(
      (booking) => booking.month === startDragMonth,
    );
    const currentDragMonthIndex = consultant.bookings.findIndex(
      (booking) => booking.month === currentDragMonth,
    );
    const index = consultant.bookings.findIndex(
      (booking) => booking.month === month,
    );

    if (startDragMonthIndex > currentDragMonthIndex) {
      return index >= currentDragMonthIndex && index <= startDragMonthIndex;
    } else {
      return index >= startDragMonthIndex && index <= currentDragMonthIndex;
    }
  }

  function handleDragEnd() {
    if (startDragMonth == undefined || currentDragMonth == undefined) return;
    if (startDragMonth == currentDragMonth) {
      resetDrag();
      return;
    }
    var firstMonth = startDragMonth;
    var lastMonth = currentDragMonth;

    if (startDragMonth > currentDragMonth) {
      firstMonth = currentDragMonth;
      lastMonth = startDragMonth;
    }

    saveMany(firstMonth, lastMonth, inputValue);
    resetDrag();
  }

  function resetDrag() {
    setStartDragMonth(undefined);
    setCurrentDragMonth(undefined);
    setPercentageDragValue(undefined);
  }

  return (
    <td
      key={month}
      className={`h-[56px]  relative ${isLastCol ? "py-0.5 pl-0.5" : "p-0.5"}`}
      ref={ref}
    >
      <div
        className={`flex  ${
          hasFreeTime ? "bg-available/50" : "bg-primary/[3%]"
        } flex-col gap-1 p-2 justify-end rounded w-full h-full relative border  hover:border-primary/30 ${
          checkIfMarked() ? " border-primary" : "border-transparent"
        }
        `}
        onMouseEnter={() => {
          setHoveredMonth(month);
        }}
        onMouseLeave={() => {
          setHoveredMonth("");
        }}
      >
        {hoveredMonth != "" && hoveredMonth == month && (
          <HoveredMonth
            hoveredRowMonth={hoveredMonth}
            consultant={consultant}
            isLastCol={isLastCol}
            isSecondLastCol={isSecondLastCol}
            columnCount={columnCount}
          />
        )}
        {bookedHoursInMonth && (
          <RenderInfoPills
            bookedHours={bookedHoursInMonth}
            columnCount={columnCount}
          />
        )}

        <div className={`flex flex-row justify-end gap-[0.05rem] `}>
          <input
            type="number"
            min={billablePercentage}
            ref={inputRef}
            max={100}
            step={10}
            value={`${Math.round(inputValue)}`}
            draggable={true}
            disabled={billablePercentage >= 100}
            onChange={handleInputChange}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            onClick={() => {
              setDropdownOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onDragStart={() => {
              setStartDragMonth(month);
              setPercentageDragValue(inputValue);
            }}
            onDragEnter={() => {
              setCurrentDragMonth(month);
            }}
            onDragEnd={handleDragEnd}
            className={`${
              billablePercentage == inputValue ? "small" : "small-medium"
            } rounded w-full bg-transparent focus:outline-none min-w-[24px] text-right ${
              uneditable ? "text-primary/60" : "text-primary"
            }`}
          />
          <span
            className={`${
              billablePercentage == inputValue ? "small" : "small-medium"
            } ${uneditable ? "text-primary/60" : "text-primary"} `}
          >
            %
          </span>
        </div>
      </div>
      {dropdownOpen && (
        <ul className="flex flex-col border border-primary/30 rounded mt-1 absolute w-[calc(100%-0.25rem)] justify-center items-end bg-white opacity-100 z-50">
          {options.map((opt, index) => (
            <li
              key={opt.toString()}
              onClick={() => handleOptionClick(opt)}
              className={`overflow-hidden whitespace-nowrap small p-1 w-full hover:bg-primary/[5%] text-right border-b-[1px] last:border-b-0 border-b-primary/[5%] ${
                index === highlightedIndex
                  ? "bg-primary/[5%]"
                  : "bg-transparent"
              }`}
            >
              {opt.toString()}%
            </li>
          ))}
        </ul>
      )}
    </td>
  );
}

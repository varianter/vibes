import {
  BookedHoursInMonth,
  ConsultantReadModel,
  ForecastReadModel,
} from "@/api-types";
import React, { useRef, useState } from "react";
import { HoveredMonth } from "./HoveredMonth";
import RenderInfoPills from "../Staffing/RenderInfoPills";
import { useOnClickOutside } from "usehooks-ts";

export function MonthCell(props: {
  bookedHoursInMonth?: BookedHoursInMonth;
  forecastValue: number;
  hasBeenEdited: boolean;
  consultant: ForecastReadModel;
  setHoveredMonth: (date: string) => void;
  hoveredMonth: string;
  month: string;
  columnCount: number;
  isLastCol: boolean;
  isSecondLastCol: boolean;
  numWorkHours: number;
}) {
  const {
    bookedHoursInMonth,
    forecastValue,
    consultant,
    hasBeenEdited,
    setHoveredMonth: setHoveredMonth,
    hoveredMonth: hoveredMonth,
    month,
    columnCount,
    isLastCol,
    isSecondLastCol,
    numWorkHours,
  } = props;

  const uneditable = forecastValue === 100;
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isChangingHours, setIsChangingHours] = useState(false);

  const [isActive, setIsActive] = useState(false);
  const [inputValue, setInputValue] = useState<number>(forecastValue);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const ref = useRef(null);

  function handleClickOutside() {
    setIsActive(false);
  }

  useOnClickOutside(ref, handleClickOutside);

  function optionGenerator(forecastValue: number) {
    const allOptions = [50, 80, 100];
    return allOptions.filter((option) => option >= forecastValue);
  }

  const options = optionGenerator(forecastValue);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(parseInt(e.target.value));
    setHighlightedIndex(-1);
  }

  function validateInput() {
    if (inputValue < forecastValue) {
      alert("Du kan ikke legge inn en prognose som er lavere enn bemanningen");
      setInputValue(forecastValue);
    } else if (inputValue > 100) {
      alert("Du kan ikke legge inn en prognose som er høyere enn 100%");
      setInputValue(forecastValue);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (isActive) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prevIndex) => (prevIndex + 1) % options.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex(
          (prevIndex) => (prevIndex - 1 + options.length) % options.length,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlightedIndex >= 0) {
          setInputValue(options[highlightedIndex]);
        }
        setIsActive(false);
      } else if (e.key === "Escape") {
        setIsActive(false);
      }
    }
  }

  function handleOptionClick(option: number) {
    setInputValue(option);
    setIsActive(false);
  }

  return (
    <td
      key={month}
      className={`h-[56px] relative ${isLastCol ? "py-0.5 pl-0.5" : "p-0.5"}`}
      ref={ref}
    >
      <div
        className={`flex bg-primary/[3%] flex-col gap-1 p-2 justify-end rounded w-full h-full relative border border-transparent hover:border-primary/30 `}
        onMouseEnter={() => {
          setHoveredMonth(month);
          setIsChangingHours(true);
        }}
        onMouseLeave={() => {
          setHoveredMonth("");
          setIsChangingHours(false);
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
            min={forecastValue}
            max={100}
            step={10}
            value={`${Math.round(inputValue)}`}
            draggable={true}
            disabled={forecastValue >= 100}
            onChange={handleInputChange}
            onFocus={(e) => {
              e.target.select();
              setIsInputFocused(true);
            }}
            onBlur={() => {
              setIsInputFocused(false);
              validateInput();
            }}
            onClick={() => {
              setIsActive(true);
            }}
            onKeyDown={handleKeyDown}
            className={`${
              forecastValue == inputValue ? "small" : "small-medium"
            } rounded w-full bg-transparent focus:outline-none min-w-[24px] text-right ${
              uneditable ? "text-primary/60" : "text-primary"
            }`}
          />
          <span
            className={`${
              forecastValue == inputValue ? "small" : "small-medium"
            } ${uneditable ? "text-primary/60" : "text-primary"} `}
          >
            %
          </span>
        </div>
      </div>
      {isActive && (
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
              {opt.toString()} <span>%</span>
            </li>
          ))}
        </ul>
      )}
    </td>
  );
}

function checkIfNotStartedOrQuit(
  consultant: ConsultantReadModel,
  bookedHoursPerMonth: BookedHoursInMonth,
  numWorkHours: number,
) {
  const notStartedOrQuitHours =
    bookedHoursPerMonth.bookingModel.totalNotStartedOrQuit;

  return (
    notStartedOrQuitHours ==
    numWorkHours - bookedHoursPerMonth.bookingModel.totalHolidayHours
  );
}

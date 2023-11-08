"use client";
import { Check, ChevronDown } from "react-feather";
import { ChevronUp } from "react-feather";
import { useState } from "react";

export default function DropDown({
  startingOption,
  dropDownOptions,
  dropDownFunction,
}: {
  startingOption: string;
  dropDownOptions: string[];
  dropDownFunction: Function;
}) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [chosenOption, setChosenOption] = useState(startingOption);

  return (
    <div className="relative">
      <button
        className={`w-[120px] py-2 px-3 flex flex-row justify-between items-center rounded-lg hover:bg-primary_default hover:bg-opacity-10 border hover:border-primary_default ${
          isDropDownOpen ? "border-primary_default" : "border-primary_l1"
        }`}
        onClick={() => setIsDropDownOpen(!isDropDownOpen)}
      >
        <p className="text-primary_default interaction-button">
          {chosenOption}
        </p>
        {isDropDownOpen ? (
          <ChevronUp className="text-primary_default w-6 h-6" />
        ) : (
          <ChevronDown className="text-primary_default w-6 h-6" />
        )}
      </button>
      <div
        className={`w-full z-50 bg-white flex flex-col p-1 absolute top-full mt-1 rounded-lg dropdown-shadow ${
          !isDropDownOpen && "hidden"
        }`}
      >
        {dropDownOptions?.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => {
              dropDownFunction(option);
              setIsDropDownOpen(false);
              setChosenOption(option);
            }}
            className="hover:bg-primary_default px-3 py-2 rounded-md hover:bg-opacity-10 flex flex-row justify-between items-center"
          >
            <p className="h-6 flex items-center interaction-button text-primary_default">
              {option}
            </p>
            {option == chosenOption && (
              <Check className="h-6 w-6 text-primary_default" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

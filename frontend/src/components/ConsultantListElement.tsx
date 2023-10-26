"use client";
import { Consultant } from "@/types";
import { useState } from "react";
import { ChevronDown } from "react-feather";

interface ConsultantListElementProps {
  consultant: Consultant;
}

export default function ConsultantListElement({
  consultant,
}: ConsultantListElementProps) {
  const [isListElementVisible, setIsListElementVisible] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  function toggleListElementVisibility() {
    setIsListElementVisible(!isListElementVisible);
  }

  return (
    <div className="flex flex-row gap-2">
      <div
        className={`py-0 w-0.5 rounded-lg ${
          isButtonHovered ? "bg-primary_default" : "bg-primary_l4"
        } ${isListElementVisible && "bg-secondary_default"}`}
      ></div>
      <div className="flex flex-col flex-grow">
        <div
          className="flex flex-row gap-2 items-center h-[52px]"
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          <button
            className={`p-2 rounded-lg hover:bg-primary_default hover:bg-opacity-10 ${
              isListElementVisible && "rotate-180"
            }`}
            onClick={toggleListElementVisibility}
          >
            <ChevronDown className={`text-primary_default w-6 h-6`} />
          </button>
          <div className="flex flex-col gap-1">
            <p
              className={`text-black text-start ${
                isListElementVisible ? "body-bold" : "body"
              }`}
            >
              {consultant.name}
            </p>
            <p className="detail text-neutral_l1 text-start">
              {`${consultant.yearsOfExperience} RÅ år`}
            </p>
          </div>
        </div>
        <div className={`${!isListElementVisible && "hidden"} h-[198px] `}>
          <p className="raa-text sm:raa-text-big py-5 sm:py-10 ml-10 px-[2px] ">
            <span className={`text-[#FF6426]`}>Du</span>{" "}
            <span className={`text-[#028377]`}>er</span>{" "}
            <span className={`text-[#534DAC]`}>RÅ!</span>
          </p>
        </div>
      </div>
    </div>
  );
}

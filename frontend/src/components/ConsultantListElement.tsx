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

  function toggleListElementVisibility() {
    setIsListElementVisible(!isListElementVisible);
  }

  return (
    <div
      className={`flex flex-col ${
        isListElementVisible && "bg-primary_l4"
      } border-t  border-primary_l4 `}
    >
      <button
        className="flex flex-row gap-3 py-0.5  hover:bg-primary_default hover:bg-opacity-5"
        onClick={toggleListElementVisibility}
      >
        <div className={`w-6 h-6 m-2 ${isListElementVisible && "rotate-180"}`}>
          <ChevronDown className={`text-primary_default`} />
        </div>
        <div className="flex flex-col justify-center items-start">
          <p className="body text-black text-sm"> {consultant.name}</p>
          <p className="detail text-neutral_l1">
            {`${consultant.yearsOfExperience} RÅ år`}
          </p>
        </div>
      </button>
      <div className={`${!isListElementVisible && "hidden"} h-[198px] `}></div>
    </div>
  );
}

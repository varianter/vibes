"use client";
import { Variant } from "@/types";
import { useState } from "react";
import { ChevronDown } from "react-feather";

interface ConsultantListElementProps {
  consultant: Variant;
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
      } border-t-2  border-primary_l4 `}
    >
      <button
        className="flex flex-row gap-6 p-3  hover:bg-primary_default hover:bg-opacity-5"
        onClick={toggleListElementVisibility}
      >
        <div className={`w-6 h-6 m-3 ${isListElementVisible && "rotate-180"}`}>
          <ChevronDown className={`text-primary_default`} />
        </div>
        <div className="flex flex-col gap-1 justify-center items-start">
          <p className="body text-black"> {consultant.name}</p>
          <p className="detail text-neutral_l1">{consultant.email}</p>
        </div>
      </button>
      <div className={`${!isListElementVisible && "hidden"} h-[198px] `}></div>
    </div>
  );
}

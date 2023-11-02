"use client";
import { Consultant } from "@/types";
import { useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  Coffee,
  FileText,
  Sun,
} from "react-feather";
import InfoPill from "./InfoPill";

interface ConsultantListElementProps {
  consultant: Consultant;
}

export default function ConsultantRows({
  consultant,
}: ConsultantListElementProps) {
  const [isListElementVisible, setIsListElementVisible] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  function toggleListElementVisibility() {
    setIsListElementVisible(!isListElementVisible);
  }

  return (
    <>
      <tr>
        <td>
          <div className="flex flex-row gap-2 ">
            <div
              className={`py-0 w-0.5 rounded-lg ${
                isButtonHovered ? "bg-primary_default" : "bg-primary_l4"
              } ${isListElementVisible && "bg-secondary_default"}`}
            ></div>
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
                  {`${consultant.yearsOfExperience} års erfaring`}
                </p>
              </div>
            </div>
          </div>
        </td>
        {consultant.bookings?.map((b) => (
          <td
            key={b.weekNumber}
            className={`px-2 py-1 rounded  ${
              b.bookingModel.totalOverbooking > 0
                ? `bg-black text-white`
                : b.bookingModel.totalSellableTime > 0
                ? `bg-semantic_4_l1`
                : `bg-primary_l5`
            }`}
          >
            <div className="flex flex-col gap-1">
              <div className="flex flex-row justify-end gap-1">
                {b.bookingModel.totalOffered > 0 && (
                  <InfoPill
                    text={b.bookingModel.totalOffered.toFixed(1)}
                    colors="bg-offer_light text-offer_dark"
                    icon={<FileText size="12" />}
                  />
                )}
                {b.bookingModel.totalSellableTime > 0 && (
                  <InfoPill
                    text={b.bookingModel.totalSellableTime.toFixed(1)}
                    colors="bg-free_light text-free_dark"
                    icon={<Coffee size="12" />}
                  />
                )}
                {b.bookingModel.totalVacationHours > 0 && (
                  <InfoPill
                    text={b.bookingModel.totalVacationHours.toFixed(1)}
                    colors="bg-vacation_light text-vacation_dark"
                    icon={<Sun size="12" />}
                  />
                )}
                {b.bookingModel.totalOverbooking > 0 && (
                  <InfoPill
                    text={b.bookingModel.totalOverbooking.toFixed(1)}
                    colors="bg-overbooking_dark text-overbooking_light"
                    icon={<AlertTriangle size="12" />}
                  />
                )}
              </div>

              <p
                className={`text-right ${
                  isListElementVisible ? "body-bold" : "body"
                }`}
              >
                {b.bookingModel.totalBillable}
              </p>
            </div>
          </td>
        ))}
      </tr>
      <tr className={`${!isListElementVisible && "hidden"} h-[198px] `}></tr>
    </>
  );
}

"use client";

import { EngagementPerCustomerReadModel, EngagementState } from "@/api-types";
import { useState } from "react";
import { ChevronDown } from "react-feather";
import {
  getColorByStaffingType,
  getIconByBookingType,
} from "../Staffing/helpers/utils";
import { getBookingTypeFromProjectState } from "../Staffing/AddEngagementHoursModal/utils";
import Link from "next/link";

export default function CostumerRow({
  customer,
}: {
  customer: EngagementPerCustomerReadModel;
}) {
  const [isListElementVisible, setIsListElementVisible] = useState(false);
  const [isRowHovered, setIsRowHovered] = useState(false);

  function toggleListElementVisibility() {
    setIsListElementVisible(!isListElementVisible);
  }

  return (
    <>
      <tr
        className="h-[52px]"
        onMouseEnter={() => setIsRowHovered(true)}
        onMouseLeave={() => setIsRowHovered(false)}
      >
        <td
          className={`border-l-2 ${
            isListElementVisible
              ? "border-l-secondary"
              : isRowHovered
              ? "border-l-primary"
              : "border-l-primary/5"
          } `}
        >
          <button
            className={`p-2 rounded-lg ml-2 hover:bg-primary hover:bg-opacity-10 ${
              isListElementVisible && "rotate-180"
            }`}
            onClick={toggleListElementVisibility}
          >
            <ChevronDown className={`text-primary w-6 h-6`} />
          </button>
        </td>
        <td>
          <Link
            className={`text-black text-start ${
              isListElementVisible ? "normal-medium" : "normal"
            }`}
            href={`kunder/${customer.customerName}`}
          >
            {customer.customerName}
          </Link>
        </td>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
          <td key={number} className={`h-[52px] p-0.5`}>
            <div
              className={`flex flex-col gap-1 p-2 justify-end rounded w-full h-full relative border border-transparent bg-primary/[3%] hover:border-primary/30 hover:cursor-pointer
          `}
              onClick={() => setIsListElementVisible(!isListElementVisible)}
            ></div>
          </td>
        ))}
      </tr>
      {isListElementVisible &&
        customer.engagements &&
        customer.engagements.map((engagement, index) => (
          <tr key={`${engagement.engagementId}-details`} className="h-fit">
            <td className="border-l-secondary border-l-2">
              <div
                className={`h-8 w-8 flex justify-center items-center rounded ml-3 ${getColorByStaffingType(
                  getBookingTypeFromProjectState(engagement.bookingType),
                )}`}
              >
                {getIconByBookingType(
                  getBookingTypeFromProjectState(engagement.bookingType),
                  16,
                )}
              </div>
            </td>
            <td className="flex flex-row gap-2 justify-start relative">
              <div className="flex flex-col justify-center">
                <p className="xsmall text-black/75 whitespace-nowrap text-ellipsis overflow-x-hidden max-w-[145px]">
                  {engagement.isBillable ? "Fakturerbart" : "Ikke-fakturerbart"}
                </p>
                <p className="text-black text-start small">
                  {engagement.engagementName}
                </p>
              </div>
            </td>
          </tr>
        ))}
    </>
  );
}

"use client";

import { EngagementPerCustomerReadModel, EngagementState } from "@/api-types";
import { useState } from "react";
import { ChevronDown } from "react-feather";
import {
  getColorByStaffingType,
  getIconByBookingType,
} from "./Staffing/helpers/utils";
import { getBookingTypeFromProjectState } from "./Staffing/AddEngagementHoursModal/utils";
import Link from "next/link";

export default function CostumerRow({
  customer,
  orgUrl,
}: {
  customer: EngagementPerCustomerReadModel;
  orgUrl: string;
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
            href={`/${orgUrl}/${customer.customerName}`}
          >
            {customer.customerName}
          </Link>
        </td>
      </tr>
      {isListElementVisible &&
        customer.engagements &&
        customer.engagements.map((engagement, index) => (
          <tr key={`${engagement.engagementId}-details`} className="h-fit">
            <td className="border-l-secondary border-l-2"></td>
            <td className="flex flex-row gap-2 justify-start relative">
              <div
                className={`h-8 w-8 flex justify-center items-center rounded ${getColorByStaffingType(
                  getBookingTypeFromProjectState(engagement.bookingType),
                )}`}
              >
                {getIconByBookingType(
                  getBookingTypeFromProjectState(engagement.bookingType),
                  16,
                )}
              </div>

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

"use client";

import { EngagementPerCustomerReadModel } from "@/api-types";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown } from "react-feather";
import {
  getColorByStaffingType,
  getIconByBookingType,
} from "../Staffing/helpers/utils";
import { getBookingTypeFromProjectState } from "../Staffing/EditEngagementHourModal/utils";
import Link from "next/link";
import ActionButton from "../Buttons/ActionButton";
import { useParams } from "next/navigation";

export default function CostumerRow({
  customer,
}: {
  customer: EngagementPerCustomerReadModel;
}) {
  const [isListElementVisible, setIsListElementVisible] = useState(false);
  const [isRowHovered, setIsRowHovered] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(customer.isActive);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { organisation } = useParams();

  function toggleListElementVisibility() {
    setIsListElementVisible((old) => !old);
  }

  async function onActivate(customerId: number, active: boolean) {
    if (isLoading) return;
    setIsLoading(true);
    setIsActive(active);
    try {
      const response = await fetch(
        `/${organisation}/kunder/api?customerId=${customerId}&activate=${active}`,
        {
          method: "PUT",
        },
      );
      if (response.status !== 200) {
        setIsActive(!active);
      }
    } catch {
      setIsActive(!active);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <tr
        className="h-[52px] hover:cursor-pointer"
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
        <td className="flex flex-row justify-between items-center h-[52px]">
          <p
            className={`text-black text-start w-full whitespace-nowrap text-ellipsis overflow-x-hidden  ${
              isListElementVisible ? "normal-medium" : "normal"
            }`}
            style={{ lineHeight: "initial" }}
            onClick={toggleListElementVisibility}
          >
            {customer.customerName}
          </p>
          <Link
            href={`kunder/${customer.customerId}`}
            className={`p-2 rounded-lg ml-2 hover:bg-primary hover:bg-opacity-10 `}
          >
            <ArrowRight className={`text-primary w-6 h-6`} />
          </Link>
        </td>
        {[1].map((number) => (
          <td key={number} className={`h-[52px] p-0.5`}>
            <div
              className={`flex flex-col gap-1 p-2 justify-end rounded w-full h-full relative 
          `}
              onClick={toggleListElementVisibility}
            ></div>
          </td>
        ))}
        <td>
          <ActionButton
            onClick={() => onActivate(customer.customerId, !customer.isActive)}
            variant="secondary"
          >
            {isActive ? "Deaktiver" : "Aktiver"}
          </ActionButton>
        </td>
      </tr>
      {isListElementVisible &&
        customer.engagements &&
        customer.engagements.map((engagement) => (
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
              <Link
                href={`prosjekt/${engagement.engagementId}`}
                className="flex flex-col justify-center"
              >
                <p className="xsmall text-black/75 whitespace-nowrap text-ellipsis overflow-x-hidden max-w-[145px]">
                  {engagement.isBillable ? "Fakturerbart" : "Ikke-fakturerbart"}
                </p>
                <p className="text-black text-start small hover:underline">
                  {engagement.engagementName}
                </p>
              </Link>
            </td>
          </tr>
        ))}
    </>
  );
}

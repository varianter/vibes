"use client";
import { BookingType, Consultant } from "@/types";
import { ReactElement, useState } from "react";
import {
  AlertTriangle,
  Briefcase,
  ChevronDown,
  Coffee,
  FileText,
  Moon,
  Sun,
} from "react-feather";
import InfoPill, { InfoPillProps, InfoPillVariant } from "./InfoPill";

interface ConsultantListElementProps {
  consultant: Consultant;
}

export default function ConsultantRows({
  consultant,
}: {
  consultant: Consultant;
}) {
  const [isListElementVisible, setIsListElementVisible] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const columnCount = consultant.bookings.length ?? 0;

  function toggleListElementVisibility() {
    setIsListElementVisible(!isListElementVisible);
  }

  return (
    <>
      <tr
        className="h-[52px]"
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        <td
          className={`border-l-2 ${
            isListElementVisible
              ? "border-l-secondary_default"
              : isButtonHovered
              ? "border-l-primary_default"
              : "border-l-primary_l4"
          } `}
        >
          <button
            className={`p-2 rounded-lg ml-2 hover:bg-primary_default hover:bg-opacity-10 ${
              isListElementVisible && "rotate-180"
            }`}
            onClick={toggleListElementVisibility}
          >
            <ChevronDown className={`text-primary_default w-6 h-6`} />
          </button>
        </td>
        <td>
          <div className="flex flex-col gap-1 ">
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
        </td>
        {consultant.bookings?.map((b) => (
          <td key={b.weekNumber} className="h-[52px] p-0.5 min-w-fit">
            <div
              className={`flex flex-col gap-1 p-2 justify-end rounded w-full h-full  ${
                b.bookingModel.totalOverbooking > 0
                  ? `bg-black text-white`
                  : b.bookingModel.totalSellableTime > 0
                  ? `bg-semantic_4_l1`
                  : `bg-primary_l5`
              }`}
            >
              <div className="flex flex-row justify-end gap-1">
                {b.bookingModel.totalOffered > 0 && (
                  <InfoPill
                    text={b.bookingModel.totalOffered.toFixed(1)}
                    colors="bg-offer_light text-offer_dark"
                    icon={<FileText size="12" />}
                    variant={getInfopillVariantByColumnCount(columnCount)}
                  />
                )}
                {b.bookingModel.totalSellableTime > 0 &&
                  getInfopillVariantByColumnCount(columnCount) !== "narrow" && (
                    <InfoPill
                      text={b.bookingModel.totalSellableTime.toFixed(1)}
                      colors="bg-free_light text-free_dark"
                      icon={<Coffee size="12" />}
                      variant={getInfopillVariantByColumnCount(columnCount)}
                    />
                  )}
                {b.bookingModel.totalVacationHours > 0 && (
                  <InfoPill
                    text={b.bookingModel.totalVacationHours.toFixed(1)}
                    colors="bg-vacation_light text-vacation_dark"
                    icon={<Sun size="12" />}
                    variant={getInfopillVariantByColumnCount(columnCount)}
                  />
                )}
                {b.bookingModel.totalOverbooking > 0 && (
                  <InfoPill
                    text={b.bookingModel.totalOverbooking.toFixed(1)}
                    colors="bg-overbooking_dark text-overbooking_light"
                    icon={<AlertTriangle size="12" />}
                    variant={getInfopillVariantByColumnCount(columnCount)}
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
      {isListElementVisible &&
        consultant.detailedBooking &&
        consultant.detailedBooking.map((db) => (
          <tr
            key={`${consultant.id}-details-${db.bookingDetails.name}`}
            className="h-fit"
          >
            <td
              className={`${
                isListElementVisible && "border-l-secondary_default border-l-2"
              }`}
            ></td>
            <td className="flex flex-row gap-2 justify-start h-[32px]">
              <div
                className={`h-[32px] w-[32px] flex justify-center align-middle items-center rounded ${getColorByStaffingType(
                  db.bookingDetails.type,
                )}`}
              >
                {getIconByBookingType(db.bookingDetails.type)}
              </div>
              <div className="flex flex-col justify-between items-start">
                <p className="detail text-neutral_l1 text-right">
                  {db.bookingDetails.type}
                </p>
                <p className="text-black text-start body-small">
                  {db.bookingDetails.name}
                </p>
              </div>
            </td>
            {db.hours
              .sort((a, b) => a.week - b.week)
              .map((h) => (
                <td
                  key={`${consultant.id}-details-${db.bookingDetails.name}-${h.week}`}
                  className="h-8 p-0.5"
                >
                  <p
                    className={`text-right body-small-bold px-2 py-1 rounded h-full
             ${getColorByStaffingType(
               db.bookingDetails.type ?? BookingType.Offer,
             )}`}
                  >
                    {h.hours}
                  </p>
                </td>
              ))}
          </tr>
        ))}
      {isListElementVisible && (
        <tr>
          <td
            className={`${
              isListElementVisible && "border-l-secondary_default border-l-2"
            }`}
          ></td>
          <td>
            <button
              disabled
              className="detail text-neutral_l1 text-sm font-semibold leading-none"
            >
              + Legg til bemanning
            </button>
          </td>
        </tr>
      )}
      <tr className="h-1" />
    </>
  );
}

function getColorByStaffingType(type: BookingType): string {
  switch (type) {
    case BookingType.Offer:
      return "bg-offer_light";
    case BookingType.Booking:
      return "bg-primary_l5";
    case BookingType.Vacation:
      return "bg-vacation_light";
    case BookingType.PlannedAbsence:
      return "bg-absence_light";
    default:
      return "";
  }
}

function getIconByBookingType(type: BookingType): ReactElement {
  switch (type) {
    case BookingType.Offer:
      return <FileText size={16} />;
    case BookingType.Booking:
      return <Briefcase size={16} />;
    case BookingType.Vacation:
      return <Sun size={16} />;
    case BookingType.PlannedAbsence:
      return <Moon size={16} />;
    default:
      return <></>;
  }
}

function getInfopillVariantByColumnCount(count: number): InfoPillVariant {
  switch (true) {
    case 26 <= count:
      return "narrow";
    case 12 <= count && count < 26:
      return "medium";
    case count < 12:
      return "wide";
    default:
      return "wide";
  }
}

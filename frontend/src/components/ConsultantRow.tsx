"use client";
import {
  BookedHoursPerWeek,
  BookingType,
  Consultant,
  DetailedBooking,
} from "@/types";
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
import InfoPill, { InfoPillVariant } from "./InfoPill";

export default function ConsultantRows({
  consultant,
}: {
  consultant: Consultant;
}) {
  const [isListElementVisible, setIsListElementVisible] = useState(false);
  const [isRowHovered, setIsRowHovered] = useState(false);
  const [hoveredRowWeek, setHoveredRowWeek] = useState(-1);

  const columnCount = consultant.bookings.length ?? 0;

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
              ? "border-l-secondary_default"
              : isRowHovered
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
        {consultant.bookings?.map((b, index) => (
          <WeekCell
            key={index}
            bookedHoursPerWeek={b}
            isListElementVisible={isListElementVisible}
            consultant={consultant}
            setHoveredRowWeek={setHoveredRowWeek}
            hoveredRowWeek={hoveredRowWeek}
            columnCount={columnCount}
          />
        ))}
      </tr>
      {isListElementVisible &&
        consultant.detailedBooking &&
        consultant.detailedBooking.map((db, index) => (
          <DetailedBookingRows
            key={index}
            consultant={consultant}
            detailedBooking={db}
            isListElementVisible={isListElementVisible}
          />
        ))}
      {isListElementVisible && (
        <tr>
          <td className={`${"border-l-secondary_default border-l-2"}`}></td>
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
      return <FileText size={16} className="text-offer_dark" />;
    case BookingType.Booking:
      return <Briefcase size={16} className="text-black" />;
    case BookingType.Vacation:
      return <Sun size={16} className="text-vacation_dark" />;
    case BookingType.PlannedAbsence:
      return <Moon size={16} className="text-absence_dark" />;
    default:
      return <></>;
  }
}

function WeekCell(props: {
  bookedHoursPerWeek: BookedHoursPerWeek;
  isListElementVisible: boolean;
  consultant: Consultant;
  setHoveredRowWeek: (number: number) => void;
  hoveredRowWeek: number;
  columnCount: number;
}) {
  const {
    bookedHoursPerWeek: bookedHoursPerWeek,
    isListElementVisible,
    consultant,
    setHoveredRowWeek,
    hoveredRowWeek,
    columnCount,
  } = props;

  return (
    <td key={bookedHoursPerWeek.weekNumber} className="h-[52px] px-0.5">
      <div
        className={`flex flex-col gap-1 p-2 justify-end rounded w-full h-full relative ${
          bookedHoursPerWeek.bookingModel.totalOverbooking > 0
            ? `bg-black text-white`
            : bookedHoursPerWeek.bookingModel.totalSellableTime > 0
            ? `bg-semantic_4_l1`
            : `bg-primary_l5`
        }`}
        onMouseEnter={() => setHoveredRowWeek(bookedHoursPerWeek.weekNumber)}
        onMouseLeave={() => setHoveredRowWeek(-1)}
      >
        <HoveredWeek
          hoveredRowWeek={hoveredRowWeek}
          bookedHoursPerWeek={bookedHoursPerWeek}
          consultant={consultant}
        />
        <div className="flex flex-row justify-end gap-1">
          {bookedHoursPerWeek.bookingModel.totalOffered > 0 && (
            <InfoPill
              text={bookedHoursPerWeek.bookingModel.totalOffered.toFixed(1)}
              colors="bg-offer_light text-offer_dark"
              icon={<FileText size="12" />}
              variant={getInfopillVariantByColumnCount(columnCount)}
            />
          )}
          {bookedHoursPerWeek.bookingModel.totalSellableTime > 0 &&
            getInfopillVariantByColumnCount(columnCount) !== "narrow" && (
              <InfoPill
                text={bookedHoursPerWeek.bookingModel.totalSellableTime.toFixed(
                  1,
                )}
                colors="bg-free_light text-free_dark"
                icon={<Coffee size="12" />}
                variant={getInfopillVariantByColumnCount(columnCount)}
              />
            )}
          {bookedHoursPerWeek.bookingModel.totalVacationHours > 0 && (
            <InfoPill
              text={bookedHoursPerWeek.bookingModel.totalVacationHours.toFixed(
                1,
              )}
              colors="bg-vacation_light text-vacation_dark"
              icon={<Sun size="12" />}
              variant={getInfopillVariantByColumnCount(columnCount)}
            />
          )}
          {bookedHoursPerWeek.bookingModel.totalOverbooking > 0 && (
            <InfoPill
              text={bookedHoursPerWeek.bookingModel.totalOverbooking.toFixed(1)}
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
          {bookedHoursPerWeek.bookingModel.totalBillable}
        </p>
      </div>
    </td>
  );
}

function HoveredWeek(props: {
  hoveredRowWeek: number;
  bookedHoursPerWeek: BookedHoursPerWeek;
  consultant: Consultant;
}) {
  const { hoveredRowWeek, bookedHoursPerWeek, consultant } = props;
  return (
    <div
      className={`absolute bottom-full left-1/2 -translate-x-1/2 flex flex-col items-center ${
        (hoveredRowWeek != bookedHoursPerWeek.weekNumber ||
          consultant.detailedBooking
            .map((d) =>
              d.hours
                .filter((h) => h.week % 100 == bookedHoursPerWeek.weekNumber)
                .reduce((sum, h) => sum + h.hours, 0),
            )
            .reduce((a, b) => a + b, 0) == 0) &&
        "hidden"
      }`}
    >
      <div className="rounded-lg bg-white flex flex-col gap-2 min-w-[222px] p-3 shadow-xl">
        {consultant.detailedBooking.map((detailedBooking, index) => (
          <div key={index}>
            {detailedBooking.hours.find(
              (hour) => hour.week % 100 == bookedHoursPerWeek.weekNumber,
            )?.hours != 0 && (
              <div
                key={index}
                className={`flex flex-row gap-2 justify-between items-center
                ${
                  index <
                    consultant.detailedBooking.filter(
                      (db) =>
                        db.hours.find(
                          (hour) =>
                            hour.week % 100 == bookedHoursPerWeek.weekNumber,
                        )?.hours != 0,
                    ).length -
                      1 && "border-b pb-2 border-hover_background"
                }`}
              >
                <div className="flex flex-row gap-2 items-center">
                  <div
                    className={`h-8 w-8 flex justify-center align-middle items-center rounded ${getColorByStaffingType(
                      detailedBooking.bookingDetails.type,
                    )}`}
                  >
                    {getIconByBookingType(detailedBooking.bookingDetails.type)}
                  </div>
                  <p className="text-black whitespace-nowrap">
                    {detailedBooking.bookingDetails.name}
                  </p>
                </div>
                <p className="text-black text-opacity-60">
                  {
                    detailedBooking.hours.find(
                      (hour) =>
                        hour.week % 100 == bookedHoursPerWeek.weekNumber,
                    )?.hours
                  }
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="w-0 h-0 border-l-[12px] border-l-transparent border-t-[16px] border-t-white border-r-[12px] border-r-transparent"></div>
    </div>
  );
}

function DetailedBookingRows(props: {
  consultant: Consultant;
  detailedBooking: DetailedBooking;
  isListElementVisible: true;
}) {
  const { consultant, detailedBooking, isListElementVisible } = props;
  return (
    <tr
      key={`${consultant.id}-details-${detailedBooking.bookingDetails.name}`}
      className="h-fit"
    >
      <td
        className={`${
          isListElementVisible && "border-l-secondary_default border-l-2"
        }`}
      ></td>
      <td className="flex flex-row gap-2 justify-start h-8">
        <div
          className={`h-8 w-8 flex justify-center align-middle items-center rounded ${getColorByStaffingType(
            detailedBooking.bookingDetails.type,
          )}`}
        >
          {getIconByBookingType(detailedBooking.bookingDetails.type)}
        </div>
        <div className="flex flex-col justify-between items-start">
          <p className="detail text-neutral_l1 text-right">
            {detailedBooking.bookingDetails.type}
          </p>
          <p className="text-black text-start body-small">
            {detailedBooking.bookingDetails.name}
          </p>
        </div>
      </td>
      {detailedBooking.hours
        .sort((a, b) => a.week - b.week)
        .map((hours) => (
          <td
            key={`${consultant.id}-details-${detailedBooking.bookingDetails.name}-${hours.week}`}
            className="h-8 p-0.5"
          >
            <p
              className={`text-right body-small-bold px-2 py-1 rounded h-full
     ${getColorByStaffingType(
       detailedBooking.bookingDetails.type ?? BookingType.Offer,
     )}`}
            >
              {hours.hours}
            </p>
          </td>
        ))}
    </tr>
  );
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

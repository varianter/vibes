import { BookingType, Consultant } from "@/types";
import {
  getColorByStaffingType,
  getIconByBookingType,
  isWeekBookingZeroHours,
} from "@/components/Staffing/helpers/utils";
import React from "react";

export function HoveredWeek(props: {
  hoveredRowWeek: number;
  consultant: Consultant;
  isLastCol: boolean;
  isSecondLastCol: boolean;
  columnCount: number;
}) {
  const {
    hoveredRowWeek,
    consultant,
    isLastCol,
    isSecondLastCol,
    columnCount,
  } = props;

  const nonZeroHoursDetailedBookings = consultant.detailedBooking.filter(
    (d) => !isWeekBookingZeroHours(d, hoveredRowWeek),
  );

  const freeTime = consultant.bookings.find(
    (b) => b.weekNumber == hoveredRowWeek,
  )?.bookingModel.totalSellableTime;

  if (freeTime && freeTime > 0) {
    nonZeroHoursDetailedBookings.push({
      bookingDetails: {
        type: BookingType.Available,
        projectName: "",
        customerName: "Ledig Tid",
        projectId: "",
      },
      hours: [
        {
          week: hoveredRowWeek,
          hours:
            consultant.bookings.find((b) => b.weekNumber == hoveredRowWeek)
              ?.bookingModel.totalSellableTime || 0,
        },
      ],
    });
  }

  return (
    <>
      <div
        className={`rounded-lg bg-white gap-3 min-w-[222px] p-3 shadow-xl absolute bottom-full mb-2 flex flex-col z-20 pointer-events-none ${
          isLastCol || (isSecondLastCol && columnCount >= 26)
            ? "right-0 "
            : "left-1/2 -translate-x-1/2"
        } ${nonZeroHoursDetailedBookings.length == 0 && "hidden"}`}
      >
        {nonZeroHoursDetailedBookings.map((detailedBooking, index) => (
          <div
            key={index}
            className={`flex flex-row gap-2 justify-between items-center
            ${
              index < nonZeroHoursDetailedBookings.length - 1 &&
              "pb-3 border-b border-black/10"
            }`}
          >
            <div className="flex flex-row gap-2 items-center">
              <div
                className={`h-8 w-8 flex justify-center align-middle items-center rounded ${getColorByStaffingType(
                  detailedBooking.bookingDetails.type,
                )}`}
              >
                {getIconByBookingType(detailedBooking.bookingDetails.type, 16)}
              </div>
              <div className="flex flex-col">
                <p
                  className={`xsmall text-black/75 ${
                    !(
                      detailedBooking.bookingDetails.type ==
                        BookingType.Offer ||
                      detailedBooking.bookingDetails.type == BookingType.Booking
                    ) && "hidden"
                  }`}
                >
                  {detailedBooking.bookingDetails.projectName}
                </p>
                <p className="small text-black whitespace-nowrap">
                  {detailedBooking.bookingDetails.customerName}
                </p>
              </div>
            </div>
            <p className="small text-black/75">
              {
                detailedBooking.hours.find(
                  (hour) => hour.week % 100 == hoveredRowWeek,
                )?.hours
              }
            </p>
          </div>
        ))}
      </div>
      <div
        className={`absolute bottom-full mb-[2px] left-1/2 -translate-x-1/2 flex items-center z-50 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-white border-r-[8px] border-r-transparent pointer-events-none ${
          nonZeroHoursDetailedBookings.length == 0 && "hidden"
        }`}
      ></div>
    </>
  );
}

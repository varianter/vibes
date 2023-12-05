"use client";
import ConsultantRows from "./Staffing/ConsultantRow";
import { isCurrentWeek } from "@/hooks/staffing/dateTools";
import { useConsultantsFilter } from "@/hooks/staffing/useConsultantsFilter";
import { useUrlRouteFilter } from "@/hooks/staffing/useUrlRouteFilter";
import InfoPill from "./Staffing/InfoPill";
import { Calendar } from "react-feather";
import StaffingSums from "./StaffingSums";
import React from "react";
import { BookedHoursPerWeek } from "@/api-types";

export default function StaffingTable() {
  const {
    filteredConsultants,
    weeklyTotalBillable,
    weeklyTotalBillableAndOffered,
    weeklyInvoiceRates,
  } = useConsultantsFilter();

  const { weekSpan } = useUrlRouteFilter();

  return (
    <table
      className={`w-full ${
        weekSpan > 23
          ? "min-w-[1400px]"
          : weekSpan > 11
          ? "min-w-[850px]"
          : "min-w-[700px]"
      } table-fixed`}
    >
      <colgroup>
        <col span={1} className="w-14" />
        <col span={1} className="w-[190px]" />
        {filteredConsultants
          .at(0)
          ?.bookings.map((_, index) => <col key={index} span={1} />)}
      </colgroup>
      <thead>
        <tr className="sticky -top-6 bg-white z-10">
          <th colSpan={2} className="pt-3 pl-2 -left-2 relative bg-white">
            <div className="flex flex-row gap-3 pb-4 items-center">
              <p className="normal-medium ">Konsulenter</p>
              <p className="text-primary small-medium rounded-full bg-primary/5 px-2 py-1">
                {filteredConsultants?.length}
              </p>
            </div>
          </th>
          {filteredConsultants
            .at(0)
            ?.bookings.map((booking: BookedHoursPerWeek) => (
              <th key={booking.weekNumber} className=" px-2 py-1 pt-3 ">
                <div className="flex flex-col gap-1">
                  {isCurrentWeek(booking.weekNumber, booking.year) ? (
                    <div className="flex flex-row gap-2 items-center justify-end">
                      {booking.bookingModel.totalHolidayHours > 0 && (
                        <InfoPill
                          text={booking.bookingModel.totalHolidayHours.toFixed(
                            1,
                          )}
                          icon={<Calendar size="12" />}
                          colors={"bg-holiday text-holiday_darker w-fit"}
                          variant={weekSpan < 24 ? "wide" : "medium"}
                        />
                      )}
                      <div className="h-2 w-2 rounded-full bg-primary" />

                      <p className="normal-medium text-right">
                        {booking.weekNumber}
                      </p>
                    </div>
                  ) : (
                    <div
                      className={`flex justify-end ${
                        weekSpan >= 26
                          ? "min-h-[30px] flex-col mb-2 gap-[1px] items-end"
                          : "flex-row gap-2"
                      }`}
                    >
                      {booking.bookingModel.totalHolidayHours > 0 && (
                        <InfoPill
                          text={booking.bookingModel.totalHolidayHours.toFixed(
                            1,
                          )}
                          icon={<Calendar size="12" />}
                          colors={"bg-holiday text-holiday_darker w-fit"}
                          variant={weekSpan < 24 ? "wide" : "medium"}
                        />
                      )}
                      <p className="normal text-right">{booking.weekNumber}</p>
                    </div>
                  )}

                  <p
                    className={`xsmall text-black/75 text-right ${
                      weekSpan >= 26 && "hidden"
                    }`}
                  >
                    {booking.dateString}
                  </p>
                </div>
              </th>
            ))}
        </tr>
      </thead>
      <tbody>
        {filteredConsultants?.map((consultant) => (
          <ConsultantRows key={consultant.id} consultant={consultant} />
        ))}
      </tbody>
      <StaffingSums
        weeklyTotalBillable={weeklyTotalBillable}
        weeklyTotalBillableAndOffered={weeklyTotalBillableAndOffered}
        weeklyInvoiceRates={weeklyInvoiceRates}
      />
    </table>
  );
}

"use client";

import { isCurrentWeek } from "@/hooks/staffing/dateTools";
import { useConsultantsFilter } from "@/hooks/staffing/useConsultantsFilter";
import InfoPill from "../Staffing/InfoPill";
import { Calendar } from "react-feather";
import React, { useContext, useEffect, useState } from "react";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import ForecastRows from "./ForecastRows";
import { MockConsultantsForForecast } from "../../../mockdata/mockData";
import { fetchPublicHolidays } from "@/hooks/fetchPublicHolidays";
import { usePathname } from "next/navigation";
import { getBusinessHoursPerMonth } from "./BusinessHoursPerMonth";

const months = [
  "Januar",
  "Februar",
  "Mars",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const monthsShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

function mapMonthToNumber(month: string) {
  return monthsShort.indexOf(month);
}
function isCurrentMonth(month: number) {
  return month === 0;
}
export default function ForecastTable() {
  const {
    numWorkHours,
    filteredConsultants,
    weeklyTotalBillable,
    weeklyTotalBillableAndOffered,
    weeklyInvoiceRates,
  } = useConsultantsFilter();
  const [publicHolidays, setPublicHolidays] = useState<string[]>([]);
  const organisationName = usePathname().split("/")[1];
  const { weekSpan } = useContext(FilteredContext).activeFilters;
  const year = 2025;
  useEffect(() => {
    if (organisationName) {
      fetchPublicHolidays(organisationName).then((res) => {
        if (res) {
          setPublicHolidays(res);
        }
      });
    }
  }, [organisationName]);

  return (
    <table className={`w-full table-fixed`}>
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
              <p className="text-primary small-medium rounded-full bg-secondary/30 px-2 py-1">
                {filteredConsultants?.length}
              </p>
            </div>
          </th>
          {monthsShort.map((month, index) => (
            <th key={month} className=" px-2 py-1 pt-3 ">
              <div className="flex flex-col gap-1">
                {isCurrentMonth(mapMonthToNumber(month)) ? (
                  <div className="flex flex-row gap-2 items-center justify-end">
                    {/* {booking.bookingModel.totalHolidayHours > 0 && (
                      <InfoPill
                        text={booking.bookingModel.totalHolidayHours.toLocaleString(
                          "nb-No",
                          {
                            maximumFractionDigits: 1,
                            minimumFractionDigits: 0,
                          },
                        )}
                        icon={<Calendar size="12" />}
                        colors={"bg-holiday text-holiday_darker w-fit"}
                        variant={weekSpan < 24 ? "wide" : "medium"}
                      />
                    )} */}
                    <div className="h-2 w-2 rounded-full bg-primary" />

                    <p className="normal-medium text-right">{month}</p>
                  </div>
                ) : (
                  <div
                    className={`flex justify-end ${
                      weekSpan >= 26
                        ? "min-h-[30px] flex-col mb-2 gap-[1px] items-end"
                        : "flex-row gap-2"
                    }`}
                  >
                    {/*  {booking.bookingModel.totalHolidayHours > 0 && (
                      <InfoPill
                        text={booking.bookingModel.totalHolidayHours.toLocaleString(
                          "nb-No",
                          {
                            maximumFractionDigits: 1,
                            minimumFractionDigits: 0,
                          },
                        )}
                        icon={<Calendar size="12" />}
                        colors={"bg-holiday text-holiday_darker w-fit"}
                        variant={weekSpan < 24 ? "wide" : "medium"}
                      />
                    )} */}
                    <p className="normal text-right">{month}</p>
                  </div>
                )}
                <p className="flex justify-end xsmall">
                  {publicHolidays.length > 0
                    ? "" +
                      getBusinessHoursPerMonth(
                        index,
                        year,
                        numWorkHours,
                        publicHolidays,
                      ) +
                      "t"
                    : " "}
                </p>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {MockConsultantsForForecast.map((consultant) => (
          <ForecastRows
            key={consultant.id}
            consultant={consultant}
            numWorkHours={numWorkHours}
          />
        ))}
      </tbody>
    </table>
  );
}

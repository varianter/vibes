"use client";

import { useConsultantsFilter } from "@/hooks/staffing/useConsultantsFilter";
import React, { useEffect, useState } from "react";
import ForecastRows from "./ForecastRows";
import { fetchPublicHolidays } from "@/hooks/fetchPublicHolidays";
import { usePathname } from "next/navigation";
import { getBusinessHoursPerMonth } from "./BusinessHoursPerMonth";
import { useForecastFilter } from "@/hooks/ForecastFilter/useForecastFilter";

function isCurrentMonth(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  return (
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  );
}

function getShortenedMonthName(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("nb-NO", { month: "short" });
}

export default function ForecastTable() {
  const { filteredForecasts } = useForecastFilter();
  const { numWorkHours } = useConsultantsFilter();

  const [publicHolidays, setPublicHolidays] = useState<string[]>([]);
  const organisationName = usePathname().split("/")[1];

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
    <table className={`table-fixed`}>
      <colgroup>
        <col span={1} className="w-[190px]" />
        {filteredForecasts[0].forecasts.map((m) => (
          <col
            key={`${m.month}`}
            span={1}
            className={`w-[calc((1%/15)*100)]`}
          />
        ))}
      </colgroup>
      <thead>
        <tr className="sticky -top-6 bg-white z-10">
          <th colSpan={1} className="pt-3 pl-2 -left-2 relative bg-white">
            <div className="flex flex-row gap-3 pb-4 items-center">
              <p className="normal-medium ">Konsulenter</p>
              <p className="text-primary small-medium rounded-full bg-secondary/30 px-2 py-1">
                {filteredForecasts?.length}
              </p>
            </div>
          </th>
          {filteredForecasts[0].forecasts.map((month) => (
            <th key={"" + month.month} className=" px-2 py-1 pt-3 ">
              <div className="flex flex-col gap-1">
                {isCurrentMonth(month.month) ? (
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

                    <p className="normal-medium text-right">
                      {getShortenedMonthName(month.month)}
                    </p>
                  </div>
                ) : (
                  <div
                    className={`flex justify-end
                         flex-row gap-2
                    `}
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
                    <p className="normal text-right">
                      {getShortenedMonthName(month.month)}
                    </p>
                  </div>
                )}
                <p className="flex justify-end xsmall">
                  {publicHolidays.length > 0
                    ? "" +
                      getBusinessHoursPerMonth(
                        month.month,
                        numWorkHours,
                        publicHolidays,
                      ) +
                      "t"
                    : "\u00A0"}
                </p>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredForecasts.map((forecast) => (
          <ForecastRows
            key={forecast.consultant.id}
            forecast={forecast}
            numWorkHours={numWorkHours}
          />
        ))}
      </tbody>
    </table>
  );
}

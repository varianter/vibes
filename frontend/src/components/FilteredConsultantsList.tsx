"use client";
import ConsultantRows from "./ConsultantRow";
import ActiveFilters from "./ActiveFilters";
import WeekSelection from "@/components/WeekSelection";
import { isCurrentWeek } from "@/hooks/staffing/dateTools";
import { useConsultantsFilter } from "@/hooks/staffing/useConsultantsFilter";
import { useUrlRouteFilter } from "@/hooks/staffing/useUrlRouteFilter";
import StaffingSums from "./StaffingSums";

export default function FilteredConsultantList() {
  const {
    filteredConsultants,
    weeklyTotalBillable,
    weeklyTotalBillableAndOffered,
    weeklyInvoiceRates,
  } = useConsultantsFilter();

  const { weekSpan } = useUrlRouteFilter();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-row justify-between items-center">
        <ActiveFilters />
        <WeekSelection />
      </div>
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
            ?.bookings?.map((booking, index) => <col key={index} span={1} />)}
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
            {filteredConsultants.at(0)?.bookings?.map((booking) => (
              <th
                key={booking.weekNumber}
                className="m-2 px-2 py-1 pt-3 gap-1 justify-items-end"
              >
                {isCurrentWeek(booking.weekNumber, booking.year) ? (
                  <div className="flex flex-row gap-2 items-center justify-end">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <p
                      className={`normal-medium ${
                        weekSpan >= 26 ? "text-center" : "text-right"
                      }`}
                    >
                      {booking.weekNumber}
                    </p>
                  </div>
                ) : (
                  <p
                    className={`normal ${
                      weekSpan >= 26 ? "text-center" : "text-right"
                    }`}
                  >
                    {booking.weekNumber}
                  </p>
                )}

                <p
                  className={`xsmall text-black/75 text-right ${
                    weekSpan >= 26 && "hidden"
                  }`}
                >
                  {booking.dateString}
                </p>
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
    </div>
  );
}

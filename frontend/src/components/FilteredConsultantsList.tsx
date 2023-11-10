"use client";
import ConsultantRows from "./ConsultantRow";
import ActiveFilters from "./ActiveFilters";
import WeekSelection from "@/components/WeekSelection";
import { isCurrentWeek } from "@/hooks/staffing/dateTools";
import { useConsultantsFilter } from "@/hooks/staffing/useConsultantsFilter";

export default function FilteredConsultantList() {
  const { filteredConsultants } = useConsultantsFilter();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <ActiveFilters />
        <WeekSelection />
      </div>
      <table className="w-full min-w-[1000px] table-fixed">
        <colgroup>
          <col span={1} className="w-14" />
          <col span={1} className="w-[190px]" />
          {filteredConsultants
            .at(0)
            ?.bookings?.map((booking, index) => <col key={index} span={1} />)}
        </colgroup>
        <thead>
          <tr className="sticky -top-6 bg-white z-50">
            <th colSpan={2} className="pt-3 pl-2 -left-2 relative bg-white">
              <div className="flex flex-row gap-3 pb-4 items-center">
                <p className="body-large-bold ">Konsulenter</p>
                <p className="text-primary_default body-small-bold rounded-full bg-primary_l3 px-2 py-1">
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
                    <div className="h-2 w-2 rounded-full bg-primary_default" />
                    <p className="body-bold text-right">{booking.weekNumber}</p>
                  </div>
                ) : (
                  <p className="body text-right">{booking.weekNumber}</p>
                )}

                <p className="detail text-neutral_l1 text-right">
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
      </table>
    </div>
  );
}

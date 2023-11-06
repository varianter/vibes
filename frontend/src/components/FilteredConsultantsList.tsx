"use client";
import ConsultantRows from "./ConsultantRow";
import ActiveFilters from "./ActiveFilters";
import { useFilteredConsultants } from "@/hooks/useFilteredConsultants";
import WeekSelection from "@/components/WeekSelection";
import { DateTime } from "luxon";

export default function FilteredConsultantList() {
  const { filteredConsultants: consultants } = useFilteredConsultants();

  function isCurrentWeek(weekNumber: number, year: number) {
    const today = DateTime.now();
    return today.weekNumber == weekNumber && today.year == year;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <ActiveFilters />
        <WeekSelection />
      </div>
      <table className="w-full table-fixed">
        <colgroup>
          <col span={1} className="w-14" />
          <col span={1} className="w-[190px]" />
          {consultants
            .at(0)
            ?.bookings?.map((booking, index) => <col key={index} span={1} />)}
        </colgroup>
        <thead>
          <tr>
            <th colSpan={2}>
              <div className="flex flex-row gap-3 pb-4 items-center">
                <p className="body-large-bold ">Konsulenter</p>
                <p className="text-primary_default body-small-bold rounded-full bg-primary_l3 px-2 py-1">
                  {consultants?.length}
                </p>
              </div>
            </th>
            {consultants.at(0)?.bookings?.map((booking) => (
              <th
                key={booking.weekNumber}
                className="m-2 px-2 py-1 gap-1 justify-items-end"
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
          {consultants?.map((consultant) => (
            <ConsultantRows key={consultant.id} consultant={consultant} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

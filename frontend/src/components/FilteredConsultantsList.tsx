"use client";
import ConsultantListElement from "./ConsultantListElement";
import ActiveFilters from "./ActiveFilters";
import { useFilteredConsultants } from "@/hooks/useFilteredConsultants";

export default function FilteredConsultantList() {
  const { filteredConsultants: consultants } = useFilteredConsultants();
  return (
    <div>
      <div className="my-6 min-h-[56px]">
        <ActiveFilters />
      </div>
      <table className="w-full table-auto border-separate border-spacing-1">
        <tr>
          <th className="flex flex-row gap-3 pb-4 items-center ">
            <p className="body-large-bold ">Konsulenter</p>

            <div className="rounded-full bg-primary_l3 px-2 py-1">
              <p className="text-primary_default body-small-bold">
                {consultants?.length}
              </p>
            </div>
          </th>
          {consultants.at(0)?.bookings?.map((b) => (
            <th key={b.weekNumber} className="px-2 py-1">
              <div className="flex flex-col gap-1 justify-items-end">
                <p className=" body text-right">{b.weekNumber}</p>
              </div>
              <p className="detail text-neutral_l1 text-right">
                {b.dateString}
              </p>
            </th>
          ))}
        </tr>

        {consultants?.map((consultant) => (
          <ConsultantListElement key={consultant.id} consultant={consultant} />
        ))}
      </table>
    </div>
  );
}

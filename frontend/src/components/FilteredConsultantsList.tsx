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
      <div className="flex flex-row gap-3 pb-4 items-center">
        <p className="body-large-bold ">Konsulenter</p>

        <div className="rounded-full bg-primary_l3 px-2 py-1">
          <p className="text-primary_default body-small-bold">
            {consultants?.length}
          </p>
        </div>
      </div>
      {consultants?.map((consultant) => (
        <ConsultantListElement key={consultant.id} consultant={consultant} />
      ))}
    </div>
  );
}

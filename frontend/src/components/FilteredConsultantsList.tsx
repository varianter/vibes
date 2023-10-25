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
        <p className="body-large-bold ">Konsulentliste</p>

        <div className="rounded-full bg-black bg-opacity-5 px-2 py-1">
          <p className="text-black body-small">{consultants?.length}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {consultants?.map((consultant) => (
          <ConsultantListElement key={consultant.id} consultant={consultant} />
        ))}
      </div>
    </div>
  );
}

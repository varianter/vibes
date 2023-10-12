"use client";
import { useEffect, useState } from "react";
import ConsultantListElement from "./ConsultantListElement";
import { Variant } from "@/types";
import { useSearchParams } from "next/navigation";

export default function FilteredConsultantList({
  consultants,
}: {
  consultants: Variant[];
}) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const filter = searchParams.get("filter");
  const [filteredConsultants, setFilteredConsultants] = useState(consultants);

  useEffect(() => {
    var newFilteredConsultants = consultants;
    if (search && search.length > 0) {
      newFilteredConsultants = newFilteredConsultants?.filter((consultant) =>
        consultant.name.match(new RegExp(`\\b${search}.*\\b`, "gi")),
      );
    }
    if (filter && filter.length > 0) {
      newFilteredConsultants = newFilteredConsultants?.filter((consultant) =>
        filter.toLowerCase().includes(consultant.department.toLowerCase()),
      );
    }
    setFilteredConsultants(newFilteredConsultants);
  }, [consultants, filter, search]);

  return (
    <div>
      <div className="flex flex-row gap-3 pt-16 pb-4 items-center">
        <p className="body-large-bold ">Konsulentliste</p>

        <div className="rounded-full bg-black bg-opacity-5 px-2 py-1">
          <p className="text-black body-small">{filteredConsultants?.length}</p>
        </div>
      </div>
      {filteredConsultants?.map((consultant) => (
        <ConsultantListElement key={consultant.id} consultant={consultant} />
      ))}
    </div>
  );
}

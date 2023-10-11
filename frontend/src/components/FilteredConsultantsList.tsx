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
  const [filteredConsultants, setFilteredConsultants] = useState(consultants);

  useEffect(() => {
    if (search && search.length > 0) {
      const filtered = consultants?.filter((consultant) =>
        consultant.name.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredConsultants(filtered);
    } else {
      setFilteredConsultants(consultants);
    }
  }, [search, consultants]);

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

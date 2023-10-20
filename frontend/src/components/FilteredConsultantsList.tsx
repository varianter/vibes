"use client";
import ConsultantListElement from "./ConsultantListElement";
import { Consultant } from "@/types";
import { useSearchParams } from "next/navigation";
import ActiveFilters from "./ActiveFilters";

function filterConsultants(
  search: string,
  filter: string,
  consultants: Consultant[],
) {
  var newFilteredConsultants = consultants;
  if (search && search.length > 0) {
    newFilteredConsultants = newFilteredConsultants?.filter((consultant) =>
      consultant.name.match(new RegExp(`(?<!\\p{L})${search}.*\\b`, "giu")),
    );
  }
  if (filter && filter.length > 0) {
    newFilteredConsultants = newFilteredConsultants?.filter((consultant) =>
      filter.toLowerCase().includes(consultant.department.toLowerCase()),
    );
  }
  return newFilteredConsultants;
}

export default function FilteredConsultantList({
  consultants,
}: {
  consultants: Consultant[];
}) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const filter = searchParams.get("filter") || "";
  const filteredConsultants = filterConsultants(search, filter, consultants);

  return (
    <div>
      <div className="my-6 min-h-[56px]">
        <ActiveFilters />
      </div>
      <div className="flex flex-row gap-3 pb-4 items-center">
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

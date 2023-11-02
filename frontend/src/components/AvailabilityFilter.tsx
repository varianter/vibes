"use client";
import FilterButton from "./FilterButton";
import { useFilteredConsultants } from "@/hooks/useFilteredConsultants";

export default function AvailabilityFilter() {
  const { availabilityFilterOn, toggleAvailabilityFilter } =
    useFilteredConsultants();

  return (
    <div className="flex flex-col gap-2">
      <p className="body-small">Status</p>
      <div className="flex flex-col gap-2 w-52">
        <FilterButton
          label={"Ledig tid"}
          onClick={() => toggleAvailabilityFilter(!availabilityFilterOn)}
          checked={availabilityFilterOn}
        />
      </div>
    </div>
  );
}

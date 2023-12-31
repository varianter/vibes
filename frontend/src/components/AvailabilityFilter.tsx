"use client";
import { useAvailabilityFilter } from "@/hooks/staffing/useAvailabilityFilter";
import FilterButton from "./Buttons/FilterButton";

export default function AvailabilityFilter() {
  const { availabilityFilterOn, toggleAvailabilityFilter } =
    useAvailabilityFilter();

  return (
    <div className="flex flex-col gap-2">
      <p className="small">Status</p>
      <FilterButton
        label={"Ledig tid"}
        onClick={() => toggleAvailabilityFilter()}
        checked={availabilityFilterOn}
      />
    </div>
  );
}

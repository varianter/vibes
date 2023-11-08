"use client";
import { useAvailabilityFilter } from "@/hooks/staffing/useAvailabilityFilter";
import FilterButton from "./FilterButton";

export default function AvailabilityFilter() {
  const { availabilityFilterOn, toggleAvailabilityFilter } =
    useAvailabilityFilter();

  return (
    <div className="flex flex-col gap-2">
      <p className="body-small">Status</p>
      <FilterButton
        label={"Ledig tid"}
        onClick={() => toggleAvailabilityFilter(!availabilityFilterOn)}
        checked={availabilityFilterOn}
      />
    </div>
  );
}

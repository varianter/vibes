"use client";
import { useAvailabilityFilter } from "@/hooks/staffing/useAvailabilityFilter";
import FilterButton from "./Buttons/FilterButton";
import { Filter } from "react-feather";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { Context } from "react";

export default function AvailabilityFilter({
  context = FilteredContext,
}: {
  context?: Context<any>;
}) {
  const { availabilityFilterOn, toggleAvailabilityFilter } =
    useAvailabilityFilter(context);

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

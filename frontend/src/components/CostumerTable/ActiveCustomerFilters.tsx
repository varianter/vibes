"use client";
import { useContext } from "react";
import { FilteredCustomerContext } from "@/hooks/CustomerFilterProvider";

export default function ActiveCustomerFilters() {
  const filterTextComponents: string[] = [];
  const { activeFilters } = useContext(FilteredCustomerContext);

  const { searchFilter, engagementIsBillableFilter, bookingTypeFilter } =
    activeFilters;

  if (searchFilter != "") filterTextComponents.push(` "${searchFilter}"`);
  if (engagementIsBillableFilter != "") filterTextComponents.push(`engagement`);
  if (bookingTypeFilter != "")
    filterTextComponents.push(` "${bookingTypeFilter}"`);

  const filterSummaryText = filterTextComponents.join(", ");

  return (
    <div className="h-4">
      {filterSummaryText != "" && (
        <p className="small-medium text-primary"> {filterSummaryText} </p>
      )}
    </div>
  );
}

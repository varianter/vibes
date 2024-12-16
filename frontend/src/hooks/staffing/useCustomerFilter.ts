import { useContext } from "react";
import { FilteredCustomerContext } from "../CustomerFilterProvider";
import {
  EngagementPerCustomerReadModel,
  EngagementReadModel,
  EngagementState,
} from "@/api-types";

export function useCustomerFilter() {
  const { customers } = useContext(FilteredCustomerContext);

  const { searchFilter, engagementIsBillableFilter, bookingTypeFilter } =
    useContext(FilteredCustomerContext).activeFilters;

  const filteredCustomers = filterCustomers({
    search: searchFilter,
    engagementIsBillable: engagementIsBillableFilter,
    bookingType: bookingTypeFilter,
    customers,
  });
  return filteredCustomers;
}

export function filterCustomers({
  search,
  engagementIsBillable,
  bookingType,
  customers,
}: {
  search: string;
  engagementIsBillable: boolean | string;
  bookingType: EngagementState | string;
  customers: EngagementPerCustomerReadModel[];
}) {
  let newFilteredCustomers = customers;
  if (search && search.length > 0) {
    newFilteredCustomers = newFilteredCustomers?.filter(
      (customer: EngagementPerCustomerReadModel) =>
        customer.customerName.match(
          new RegExp(`(?<!\\p{L})${search}.*\\b`, "giu"),
        ),
    );
  }
  if (engagementIsBillable || engagementIsBillable == "true") {
    newFilteredCustomers = newFilteredCustomers?.filter(
      (customer: EngagementPerCustomerReadModel) =>
        customer.engagements.filter(
          (engagement: EngagementReadModel) => engagement.isBillable,
        ),
    );
  }

  if (bookingType) {
    newFilteredCustomers = newFilteredCustomers?.filter(
      (customer: EngagementPerCustomerReadModel) =>
        customer.engagements.filter(
          (engagement: EngagementReadModel) =>
            engagement.bookingType == bookingType,
        ),
    );
  }
  return newFilteredCustomers;
}

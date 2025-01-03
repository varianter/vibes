import { useContext } from "react";
import {
  EngagementPerCustomerReadModel,
  EngagementReadModel,
  EngagementState,
} from "@/api-types";
import { FilteredCustomerContext } from "./CustomerFilterProvider";

export function useCustomerFilter() {
  const { customers } = useContext(FilteredCustomerContext);

  const {
    searchFilter,
    engagementIsBillableFilter,
    bookingTypeFilter,
    isCustomerActiveFilter,
  } = useContext(FilteredCustomerContext).activeFilters;

  const filteredCustomers = filterCustomers({
    search: searchFilter,
    engagementIsBillable: engagementIsBillableFilter,
    bookingType: bookingTypeFilter,
    isCustomerActive: isCustomerActiveFilter,
    customers,
  });
  return filteredCustomers;
}

export function filterCustomers({
  search,
  engagementIsBillable,
  bookingType,
  isCustomerActive,
  customers,
}: {
  search: string;
  engagementIsBillable: boolean | string;
  bookingType: EngagementState | string;
  isCustomerActive: boolean | string;
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

  if (isCustomerActive.toString()==="true" ) {
    newFilteredCustomers = newFilteredCustomers?.filter(
      (customer: EngagementPerCustomerReadModel) =>
        customer.isActive,
    );
  }
  return newFilteredCustomers;
}

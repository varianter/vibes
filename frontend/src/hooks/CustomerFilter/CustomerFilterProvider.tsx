"use client";

import { EngagementPerCustomerReadModel, EngagementState } from "@/api-types";
import { usePathname, useSearchParams } from "next/navigation";
import { createContext, ReactNode, useEffect, useState } from "react";

export type CustomerFilters = {
  searchFilter: string;
  engagementIsBillableFilter: boolean | string;
  bookingTypeFilter: EngagementState | string;
  isCustomerActiveFilter: boolean | string;
};

interface UpdateFilterParams {
  search?: string;
  engagementIsBillable?: boolean;
  bookingType?: EngagementState;
  isCustomerActive: boolean | string;
}
export type UpdateFilters = (updateParams: UpdateFilterParams) => void;
const defaultFilters: CustomerFilters = {
  searchFilter: "",
  engagementIsBillableFilter: "",
  bookingTypeFilter: "",
  isCustomerActiveFilter: "",
};

type CustomerFilterContextType = {
  activeFilters: CustomerFilters;
  updateFilters: UpdateFilters;
  customers: EngagementPerCustomerReadModel[];
  setCustomers: React.Dispatch<
    React.SetStateAction<EngagementPerCustomerReadModel[]>
  >;
};

export const FilteredCustomerContext = createContext<CustomerFilterContextType>(
  {
    customers: [],
    setCustomers: () => null,
    activeFilters: defaultFilters,
    updateFilters: () => null,
  },
);

export function CustomerFilterProvider(props: {
  customers: EngagementPerCustomerReadModel[];
  children: ReactNode;
}) {
  const [customers, setCustomers] = useState<EngagementPerCustomerReadModel[]>(
    [],
  );
  const [activeFilters, updateFilters] = useUrlRouteFilter();

  useEffect(() => setCustomers(props.customers), [props.customers]);

  return (
    <FilteredCustomerContext.Provider
      value={{
        ...props,
        customers,
        setCustomers,
        activeFilters,
        updateFilters,
      }}
    >
      {props.children}
    </FilteredCustomerContext.Provider>
  );
}

function useUrlRouteFilter(): [CustomerFilters, UpdateFilters] {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchFilter, setSearchFilter] = useState(
    searchParams.get("search") || "",
  );
  const [engagementIsBillableFilter, setEngagementIsBillableFilter] = useState(
    searchParams.get("engagementIsBillable") || false,
  );
  const [bookingTypeFilter, setBookingTypeFilter] = useState(
    searchParams.get("bookingType") || "",
  );
  const [isCustomerActiveFilter, setIsCustomerActiveFilter] = useState<
    boolean | string
  >(searchParams.get("isCustomerActive") || "");

  function updateRoute(updateParams: UpdateFilterParams) {
    // If not defined, defaults to current value:
    const { search = searchFilter } = updateParams;
    const { engagementIsBillable = engagementIsBillableFilter } = updateParams;
    const { bookingType = bookingTypeFilter } = updateParams;
    const { isCustomerActive = isCustomerActiveFilter } = updateParams;

    const url = `${pathname}?search=${search}&isCustomerActive=${isCustomerActive}`;

    setSearchFilter(search);
    setEngagementIsBillableFilter(engagementIsBillable);
    setBookingTypeFilter(bookingType);
    setIsCustomerActiveFilter(isCustomerActive);

    window.history.pushState({}, "", url);
  }

  return [
    {
      searchFilter,
      engagementIsBillableFilter,
      bookingTypeFilter,
      isCustomerActiveFilter,
    },
    updateRoute,
  ];
}

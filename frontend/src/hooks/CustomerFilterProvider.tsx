"use client";

import { EngagementPerCustomerReadModel, EngagementState } from "@/api-types";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";

export type CustomerFilters = {
  searchFilter: string;
  engagementIsBillableFilter: boolean | string;
  bookingTypeFilter: EngagementState | string;
};

interface UpdateFilterParams {
  search?: string;
  engagementIsBillable?: boolean;
  bookingType?: EngagementState;
}
export type UpdateFilters = (updateParams: UpdateFilterParams) => void;
const defaultFilters: CustomerFilters = {
  searchFilter: "",
  engagementIsBillableFilter: "",
  bookingTypeFilter: "",
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
  const router = useRouter();
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

  function updateRoute(updateParams: UpdateFilterParams) {
    // If not defined, defaults to current value:
    const { search = searchFilter } = updateParams;
    const { engagementIsBillable = engagementIsBillableFilter } = updateParams;
    const { bookingType = bookingTypeFilter } = updateParams;

    const url = `${pathname}?search=${search}&engagementIsBillable=${engagementIsBillable}&bookingType=${bookingType}}`;

    setSearchFilter(search);
    setEngagementIsBillableFilter(engagementIsBillable);
    setBookingTypeFilter(bookingType);

    window.history.pushState({}, "", url);
  }

  return [
    {
      searchFilter,
      engagementIsBillableFilter,
      bookingTypeFilter,
    },
    updateRoute,
  ];
}

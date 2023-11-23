"use client";

import {
  Consultant,
  Department,
  EngagementPerCustomerReadModel,
} from "@/types";
import React, { createContext, ReactNode } from "react";

type FilterContextType = {
  consultants: Consultant[];
  departments: Department[];
  customers: EngagementPerCustomerReadModel[];
};

export const FilteredContext = createContext<FilterContextType>({
  consultants: [],
  departments: [],
  customers: [],
});

export function ConsultantFilterProvider(props: {
  consultants: Consultant[];
  departments: Department[];
  customers: EngagementPerCustomerReadModel[];
  children: ReactNode;
}) {
  return (
    <FilteredContext.Provider value={{ ...props }}>
      {props.children}
    </FilteredContext.Provider>
  );
}

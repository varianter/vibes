"use client";

import { Consultant, Department } from "@/types";
import React, { createContext, ReactNode } from "react";

type FilterContextType = {
  consultants: Consultant[];
  departments: Department[];
};

export const FilteredContext = createContext<FilterContextType>({
  consultants: [],
  departments: [],
});

export function ConsultantFilterProvider(props: {
  consultants: Consultant[];
  departments: Department[];
  children: ReactNode;
}) {
  return (
    <FilteredContext.Provider
      value={{ consultants: props.consultants, departments: props.departments }}
    >
      {props.children}
    </FilteredContext.Provider>
  );
}

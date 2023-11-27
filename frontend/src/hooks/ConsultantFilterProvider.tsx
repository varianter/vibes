"use client";

import {
  Consultant,
  Department,
  EngagementPerCustomerReadModel,
} from "@/types";
import { ReactNode, createContext, useState } from "react";

type FilterContextType = {
  consultants: Consultant[];
  departments: Department[];
  customers: EngagementPerCustomerReadModel[];
  isDisabledHotkeys: Boolean;
  setIsDisabledHotkeys: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FilteredContext = createContext<FilterContextType>({
  consultants: [],
  departments: [],
  customers: [],
  isDisabledHotkeys: false,
  setIsDisabledHotkeys: () => {},
});

export function ConsultantFilterProvider(props: {
  consultants: Consultant[];
  departments: Department[];
  customers: EngagementPerCustomerReadModel[];
  children: ReactNode;
}) {
  const [isDisabledHotkeys, setIsDisabledHotkeys] = useState(false);

  return (
    <FilteredContext.Provider value={{ ...props }}>
      {props.children}
    </FilteredContext.Provider>
  );
}

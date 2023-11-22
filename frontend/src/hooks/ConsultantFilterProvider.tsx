"use client";

import { Consultant, Department } from "@/types";
import React, { createContext, ReactNode, useState } from "react";

type FilterContextType = {
  consultants: Consultant[];
  departments: Department[];
  isDisabledHotkeys: Boolean;
  setIsDisabledHotkeys: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FilteredContext = createContext<FilterContextType>({
  consultants: [],
  departments: [],
  isDisabledHotkeys: false,
  setIsDisabledHotkeys: () => {},
});

export function ConsultantFilterProvider(props: {
  consultants: Consultant[];
  departments: Department[];
  children: ReactNode;
}) {
  const [isDisabledHotkeys, setIsDisabledHotkeys] = useState(false);

  return (
    <FilteredContext.Provider
      value={{
        consultants: props.consultants,
        departments: props.departments,
        isDisabledHotkeys,
        setIsDisabledHotkeys,
      }}
    >
      {props.children}
    </FilteredContext.Provider>
  );
}

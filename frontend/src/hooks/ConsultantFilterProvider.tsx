"use client";

import { Consultant, Department } from "@/types";
import React, { createContext, ReactNode, useState } from "react";

type FilterContextType = {
  consultants: Consultant[];
  setConsultants: React.Dispatch<React.SetStateAction<Consultant[]>>;
  departments: Department[];
  isDisabledHotkeys: Boolean;
  setIsDisabledHotkeys: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FilteredContext = createContext<FilterContextType>({
  consultants: [],
  setConsultants: () => {},
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
  const [consultants, setConsultants] = useState(props.consultants);

  return (
    <FilteredContext.Provider
      value={{
        consultants: consultants,
        setConsultants: setConsultants,
        departments: props.departments,
        isDisabledHotkeys,
        setIsDisabledHotkeys,
      }}
    >
      {props.children}
    </FilteredContext.Provider>
  );
}

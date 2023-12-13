"use client";

import {
  ConsultantReadModel,
  DepartmentReadModel,
  EngagementPerCustomerReadModel,
} from "@/api-types";
import React, { createContext, ReactNode, useEffect, useState } from "react";

type FilterContextType = {
  consultants: ConsultantReadModel[];
  setConsultants: React.Dispatch<React.SetStateAction<ConsultantReadModel[]>>;
  departments: DepartmentReadModel[];
  customers: EngagementPerCustomerReadModel[];
  isDisabledHotkeys: boolean;
  setIsDisabledHotkeys: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FilteredContext = createContext<FilterContextType>({
  consultants: [],
  setConsultants: () => null,
  departments: [],
  customers: [],
  isDisabledHotkeys: false,
  setIsDisabledHotkeys: () => {},
});

export function ConsultantFilterProvider(props: {
  consultants: ConsultantReadModel[];
  departments: DepartmentReadModel[];
  customers: EngagementPerCustomerReadModel[];
  children: ReactNode;
}) {
  const [isDisabledHotkeys, setIsDisabledHotkeys] = useState(false);
  const [consultants, setConsultants] = useState(props.consultants ?? []);

  useEffect(() => setConsultants(props.consultants), [props.consultants]);

  return (
    <FilteredContext.Provider
      value={{
        ...props,
        isDisabledHotkeys,
        setIsDisabledHotkeys,
        consultants,
        setConsultants,
      }}
    >
      {props.children}
    </FilteredContext.Provider>
  );
}

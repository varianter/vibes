"use client";

import {
  Consultant,
  Department,
  EngagementPerCustomerReadModel,
} from "@/types";
import React, { createContext, ReactNode, useEffect, useState } from "react";

type FilterContextType = {
  consultants: Consultant[];
  setConsultants: React.Dispatch<React.SetStateAction<Consultant[]>>;
  departments: Department[];
  customers: EngagementPerCustomerReadModel[];
  isDisabledHotkeys: boolean;
  setIsDisabledHotkeys: React.Dispatch<React.SetStateAction<boolean>>;
  closeModalOnBackdropClick: boolean;
  setCloseModalOnBackdropClick: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FilteredContext = createContext<FilterContextType>({
  consultants: [],
  setConsultants: () => null,
  departments: [],
  customers: [],
  isDisabledHotkeys: false,
  setIsDisabledHotkeys: () => {},
  closeModalOnBackdropClick: true,
  setCloseModalOnBackdropClick: () => {},
});

export function ConsultantFilterProvider(props: {
  consultants: Consultant[];
  departments: Department[];
  customers: EngagementPerCustomerReadModel[];
  children: ReactNode;
}) {
  const [isDisabledHotkeys, setIsDisabledHotkeys] = useState(false);
  const [closeModalOnBackdropClick, setCloseModalOnBackdropClick] =
    useState(true);
  const [consultants, setConsultants] = useState(props.consultants ?? []);

  useEffect(() => setConsultants(props.consultants), [props.consultants]);

  return (
    <FilteredContext.Provider
      value={{
        ...props,
        isDisabledHotkeys,
        setIsDisabledHotkeys,
        closeModalOnBackdropClick,
        setCloseModalOnBackdropClick,
        consultants,
        setConsultants,
      }}
    >
      {props.children}
    </FilteredContext.Provider>
  );
}

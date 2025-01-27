"use client";

import { ForecastReadModel } from "@/api-types";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";

type FilteredForecastsContextType = {
  forecasts: ForecastReadModel[];
  setForecasts: React.Dispatch<React.SetStateAction<ForecastReadModel[]>>;
};

export const FilteredForecastsContext =
  createContext<FilteredForecastsContextType>({
    forecasts: [],
    setForecasts: () => null,
  });

export function ForecastFilterProvider(props: {
  forecasts: ForecastReadModel[];
  children: ReactNode;
}) {
  const [forecasts, setForecasts] = useState(props.forecasts || []);

  useEffect(() => setForecasts(props.forecasts), [props.forecasts]);

  const value = useMemo(
    () => ({ forecasts, setForecasts }),
    [forecasts, setForecasts],
  );

  return (
    <FilteredForecastsContext.Provider value={value}>
      {props.children}
    </FilteredForecastsContext.Provider>
  );
}

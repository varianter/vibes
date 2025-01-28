import { useContext } from "react";
import { FilteredForecastsContext } from "./ForecastFilterProvider";

export function useForecastFilter() {
  const { forecasts, setForecasts } = useContext(FilteredForecastsContext);

  const filteredForecasts = forecasts;

  return { filteredForecasts, setForecasts };
}

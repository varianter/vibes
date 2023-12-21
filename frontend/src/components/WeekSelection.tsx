"use client";
import { useSelectedWeek } from "@/hooks/staffing/useSelectedWeek";
import { useContext } from "react";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import WeekSelector from "./WeekSelector";

export default function WeekSelection() {
  const weekSpanOptions = [8, 12, 26];

  const { weekSpan } = useContext(FilteredContext).activeFilters;

  const {
    decrementSelectedWeek,
    incrementSelectedWeek,
    resetSelectedWeek,
    setWeekSpan,
  } = useSelectedWeek();

  return (
    <WeekSelector
      weekSpan={weekSpan}
      weekSpanOptions={weekSpanOptions}
      setWeekSpan={setWeekSpan}
      resetSelectedWeek={resetSelectedWeek}
      decrementSelectedWeek={decrementSelectedWeek}
      incrementSelectedWeek={incrementSelectedWeek}
    />
  );
}

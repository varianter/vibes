"use client";
import { ArrowLeft, ArrowRight } from "react-feather";
import { useSelectedWeek } from "@/hooks/staffing/useSelectedWeek";
import DropDown from "./DropDown";
import { useUrlRouteFilter } from "@/hooks/staffing/useUrlRouteFilter";
import ActionButton from "./Buttons/ActionButton";
import IconActionButton from "./Buttons/IconActionButton";

export default function WeekSelection() {
  const weekSpanOptions = ["8 uker", "12 uker", "26 uker"];

  const { weekSpan } = useUrlRouteFilter();

  const {
    decrementSelectedWeek,
    incrementSelectedWeek,
    resetSelectedWeek,
    setWeekSpan,
  } = useSelectedWeek();

  return (
    <div className="flex flex-row gap-2">
      <DropDown
        startingOption={weekSpan ? weekSpan + " uker" : weekSpanOptions[0]}
        dropDownOptions={weekSpanOptions}
        dropDownFunction={setWeekSpan}
      />
      <ActionButton variant="secondary" onClick={resetSelectedWeek}>
        Nåværende uke
      </ActionButton>
      <IconActionButton
        variant={"secondary"}
        icon={<ArrowLeft />}
        onClick={decrementSelectedWeek}
      />
      <IconActionButton
        variant={"secondary"}
        icon={<ArrowRight />}
        onClick={incrementSelectedWeek}
      />
    </div>
  );
}

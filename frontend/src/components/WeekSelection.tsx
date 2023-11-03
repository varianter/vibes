"use client";
import { useFilteredConsultants } from "@/hooks/useFilteredConsultants";
import SecondaryButton from "@/components/SecondaryButton";
import DropDown from "./DropDown";

const weekSpanOptions = ["8 uker", "12 uker", "26 uker"];

export default function WeekSelection() {
  const {
    incrementSelectedWeek,
    resetSelectedWeek,
    decrementSelectedWeek,
    setWeekSpan,
    weekSpan,
  } = useFilteredConsultants();

  return (
    <div className="flex flex-row gap-1">
      <DropDown
        startingOption={weekSpan ? weekSpan + " uker" : weekSpanOptions[0]}
        dropDownOptions={weekSpanOptions}
        dropDownFunction={setWeekSpan}
      />
      <SecondaryButton label={"<"} onClick={decrementSelectedWeek} />
      <SecondaryButton label={"Denne uka"} onClick={resetSelectedWeek} />
      <SecondaryButton label={">"} onClick={incrementSelectedWeek} />
    </div>
  );
}

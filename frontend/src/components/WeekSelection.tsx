"use client";
import { useFilteredConsultants } from "@/hooks/useFilteredConsultants";
import SecondaryButton from "@/components/SecondaryButton";
import DropDown from "./DropDown";
import { ArrowLeft, ArrowRight } from "react-feather";
import IconSecondaryButton from "./IconSecondaryButton";

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
      <SecondaryButton label={"Denne uka"} onClick={resetSelectedWeek} />
      <IconSecondaryButton
        icon={<ArrowLeft size={24} />}
        onClick={decrementSelectedWeek}
      />
      <IconSecondaryButton
        icon={<ArrowRight size={24} />}
        onClick={incrementSelectedWeek}
      />
    </div>
  );
}

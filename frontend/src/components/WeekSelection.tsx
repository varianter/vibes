"use client";
import { useFilteredConsultants } from "@/hooks/useFilteredConsultants";
import SecondaryButton from "@/components/SecondaryButton";
import { ArrowLeft, ArrowRight } from "react-feather";
import IconSecondaryButton from "./IconSecondaryButton";

export default function WeekSelection() {
  const { incrementSelectedWeek, resetSelectedWeek, decrementSelectedWeek } =
    useFilteredConsultants();

  return (
    <div className="flex flex-row gap-1">
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

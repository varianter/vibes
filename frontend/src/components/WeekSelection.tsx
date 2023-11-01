"use client";
import { useFilteredConsultants } from "@/hooks/useFilteredConsultants";
import SecondaryButton from "@/components/SecondaryButton";

export default function WeekSelection() {
  const { incrementSelectedWeek, resetSelectedWeek, decrementSelectedWeek } =
    useFilteredConsultants();

  return (
    <div className="flex flex-row gap-1">
      <SecondaryButton label={"<"} onClick={decrementSelectedWeek} />
      <SecondaryButton label={"Denne uka"} onClick={resetSelectedWeek} />
      <SecondaryButton label={">"} onClick={incrementSelectedWeek} />
    </div>
  );
}

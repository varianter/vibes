"use client";
import SecondaryButton from "@/components/SecondaryButton";
import { ArrowLeft, ArrowRight } from "react-feather";
import IconSecondaryButton from "./IconSecondaryButton";
import { useSelectedWeek } from "@/hooks/staffing/useSelectedWeek";

export default function WeekSelection() {
  const { changeSelectedWeek, resetSelectedWeek } = useSelectedWeek();

  return (
    <div className="flex flex-row gap-1">
      <SecondaryButton label={"Denne uka"} onClick={resetSelectedWeek} />
      <IconSecondaryButton
        icon={<ArrowLeft size={24} />}
        onClick={() => changeSelectedWeek(-7)}
      />
      <IconSecondaryButton
        icon={<ArrowRight size={24} />}
        onClick={() => changeSelectedWeek(7)}
      />
    </div>
  );
}

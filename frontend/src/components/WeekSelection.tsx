"use client";
import { Filter } from "react-feather";
import { useFilteredConsultants } from "@/hooks/useFilteredConsultants";
import SecondaryButton from "@/components/SecondaryButton";

export default function WeekSelection() {
  const { setSelectedWeek, resetSelectedWeek, selectedWeek } =
    useFilteredConsultants();

  function handlePreviousWeekClick() {
    if (selectedWeek) {
      setSelectedWeek({ year: 2023, weekNumber: selectedWeek.weekNumber - 1 });
    } else {
      setSelectedWeek({ year: 2023, weekNumber: 43 });
    }
  }

  function handleNextWeekClick() {
    if (selectedWeek) {
      setSelectedWeek({ year: 2023, weekNumber: selectedWeek.weekNumber + 1 });
    } else {
      setSelectedWeek({ year: 2023, weekNumber: 45 });
    }
  }

  return (
    <div>
      <SecondaryButton label={"<"} onClick={handlePreviousWeekClick} />
      <SecondaryButton label={"Denne uka"} onClick={resetSelectedWeek} />
      <SecondaryButton label={">"} onClick={handleNextWeekClick} />
    </div>
  );
}

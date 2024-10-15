import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Week } from "@/types";
import { generateWeekList } from "@/components/Staffing/helpers/GenerateWeekList";

export function useWeekSelectors() {
  const weekSpanOptions = [8, 12, 26];
  const [selectedWeekSpan, setSelectedWeekSpan] = useState<number>(8);
  const [selectedWeek, setSelectedWeek] = useState<Week>({
    year: DateTime.now().year,
    weekNumber: DateTime.now().weekNumber,
  });

  const [weekList, setWeekList] = useState<DateTime[]>(
    generateWeekList(
      DateTime.now().set({
        weekYear: selectedWeek.year,
        weekNumber: selectedWeek.weekNumber,
      }),
      selectedWeekSpan,
    ),
  );

  useEffect(() => {
    setWeekList(
      generateWeekList(
        DateTime.now()
          .set({
            weekYear: selectedWeek.year,
            weekNumber: selectedWeek.weekNumber,
          })
          .startOf("week"),
        selectedWeekSpan,
      ),
    );
  }, [selectedWeek, selectedWeekSpan]);

  function changeSelectedWeek(numberOfWeeks: number) {
    const date = selectedWeek
      ? DateTime.now().set({
          weekYear: selectedWeek.year,
          weekNumber: selectedWeek.weekNumber,
        })
      : DateTime.now();

    const newDate = date.plus({ week: numberOfWeeks }).plus({ day: 4 });

    setSelectedWeek({ year: newDate.year, weekNumber: newDate.weekNumber });
  }

  function resetSelectedWeek() {
    setSelectedWeek({
      year: DateTime.now().year,
      weekNumber: DateTime.now().weekNumber,
    });
  }

  function incrementSelectedWeek() {
    changeSelectedWeek(selectedWeekSpan - 1);
  }

  function decrementSelectedWeek() {
    changeSelectedWeek(-(selectedWeekSpan - 1));
  }

  return {
    selectedWeek,
    weekSpanOptions,
    weekList,
    selectedWeekSpan,
    changeSelectedWeek,
    resetSelectedWeek,
    incrementSelectedWeek,
    decrementSelectedWeek,
    setSelectedWeekSpan,
  };
}

import { ArrowLeft, ArrowRight } from "react-feather";
import ActionButton from "./Buttons/ActionButton";
import IconActionButton from "./Buttons/IconActionButton";
import DropDown from "./DropDown";

type WeekSelectorProps = {
  weekSpan: number;
  weekSpanOptions: number[];
  setWeekSpan: (weekSpanNumber: number) => void;
  resetSelectedWeek: () => void;
  decrementSelectedWeek: () => void;
  incrementSelectedWeek: () => void;
};

export default function WeekSelector({
  weekSpanOptions,
  weekSpan,
  setWeekSpan,
  resetSelectedWeek,
  decrementSelectedWeek,
  incrementSelectedWeek,
}: WeekSelectorProps) {
  function getNumberFromWeekspan(weekSpanString: string) {
    const weekSpanNum = parseInt(weekSpanString.split(" ")[0]);
    setWeekSpan(weekSpanNum);
  }

  const weekSpanStringOptions = weekSpanOptions.map(
    (number) => number + " uker",
  );

  return (
    <div className="flex flex-row gap-2 justify-end">
      <DropDown
        startingOption={
          weekSpan ? weekSpan + " uker" : weekSpanStringOptions[0]
        }
        dropDownOptions={weekSpanStringOptions}
        dropDownFunction={getNumberFromWeekspan}
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

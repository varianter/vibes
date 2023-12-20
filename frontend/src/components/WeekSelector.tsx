import { ArrowLeft, ArrowRight } from "react-feather";
import ActionButton from "./Buttons/ActionButton";
import IconActionButton from "./Buttons/IconActionButton";
import DropDown from "./DropDown";

export default function WeekSelector({
  weekSpanOptions,
  weekSpan,
  setWeekSpan,
  resetSelectedWeek,
  decrementSelectedWeek,
  incrementSelectedWeek,
}: {
  weekSpan: number;
  weekSpanOptions: string[];
  setWeekSpan: (weekSpanString: string) => void;
  resetSelectedWeek: () => void;
  decrementSelectedWeek: () => void;
  incrementSelectedWeek: () => void;
}) {
  return (
    <div className="flex flex-row gap-2 justify-end">
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

import { ArrowLeft, ArrowRight } from "react-feather";
import ActionButton from "../Buttons/ActionButton";
import IconActionButton from "../Buttons/IconActionButton";
import DropDown from "../DropDown";
import { useContext } from "react";
import { FilteredForecastContext } from "@/hooks/ForecastFilter/ForecastFilterProvider";
import { useSelectedQuarter } from "@/hooks/ForecastFilter/useSelectedQuarter";

export default function QuarterSelector() {
  const monthSpanOptions = [4, 8, 12, 18];

  const { monthCount } = useContext(FilteredForecastContext).activeFilters;

  const {
    decrementSelectedQuarter,
    incrementSelectedQuarter,
    resetSelectedQuarter,
    setMonthCount,
  } = useSelectedQuarter();

  const monthCountStringOptions = monthSpanOptions.map(
    (number) => number + " måneder",
  );

  function getNumberFromMonthSpan(monthSpanString: string) {
    const monthSpanNum = parseInt(monthSpanString.split(" ")[0]);
    setMonthCount(monthSpanNum);
  }

  return (
    <div className="flex flex-row gap-2 justify-end">
      <DropDown
        startingOption={
          monthCount ? monthCount + " måneder" : monthCountStringOptions[0]
        }
        dropDownOptions={monthCountStringOptions}
        dropDownFunction={getNumberFromMonthSpan}
      />
      <ActionButton variant="secondary" onClick={resetSelectedQuarter}>
        Nåværende kvartal
      </ActionButton>
      <IconActionButton
        variant={"secondary"}
        icon={<ArrowLeft />}
        onClick={decrementSelectedQuarter}
      />
      <IconActionButton
        variant={"secondary"}
        icon={<ArrowRight />}
        onClick={incrementSelectedQuarter}
      />
    </div>
  );
}

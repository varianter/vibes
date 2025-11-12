import { ArrowLeft, ArrowRight } from "react-feather";
import { useSelectedQuarter } from "@/hooks/ForecastFilter/useForecastFilter";
import ActionButton from "../Buttons/ActionButton";
import IconActionButton from "../Buttons/IconActionButton";

export default function QuarterSelector() {
  const { nextQuarter, previousQuarter, setAsCurrentQuarter } =
    useSelectedQuarter();

  return (
    <div className="flex flex-row gap-2 justify-end">
      <ActionButton variant="secondary" onClick={setAsCurrentQuarter}>
        Nå
      </ActionButton>
      <IconActionButton
        variant={"secondary"}
        icon={<ArrowLeft />}
        onClick={previousQuarter}
      />
      <IconActionButton
        variant={"secondary"}
        icon={<ArrowRight />}
        onClick={nextQuarter}
      />
    </div>
  );
}

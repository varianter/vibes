import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { useContext } from "react";
import Select, { MultiValue } from "react-select";

export type SelectOption = { value: string; label: string };

export default function ReactSelect({
  options,
  selectedSingleOptionValue,
  selectedMultipleOptionsValue,
  onSingleOptionChange,
  onMultipleOptionsChange,
  isMultipleOptions = false,
  isDisabled = false,
  placeHolderText = "Velg...",
  isClearable = false,
}: {
  options: SelectOption[];
  selectedSingleOptionValue?: SelectOption | null;
  selectedMultipleOptionsValue?: MultiValue<SelectOption> | null;
  onSingleOptionChange?: (arg: SelectOption) => void;
  onMultipleOptionsChange?: (arg: MultiValue<SelectOption>) => void;
  isMultipleOptions?: boolean;
  isDisabled?: boolean;
  placeHolderText?: string;
  isClearable?: boolean;
}) {
  const { setCloseModalOnBackdropClick } = useContext(FilteredContext);

  return (
    <Select
      onFocus={() => setCloseModalOnBackdropClick(false)}
      onBlur={() => setCloseModalOnBackdropClick(true)}
      placeholder={placeHolderText}
      isMulti={isMultipleOptions}
      options={options}
      isDisabled={isDisabled}
      isClearable={isClearable}
      value={
        isMultipleOptions
          ? selectedMultipleOptionsValue
          : selectedSingleOptionValue
      }
      onChange={(a) => {
        a && isMultipleOptions
          ? onMultipleOptionsChange?.(a as MultiValue<SelectOption>)
          : onSingleOptionChange?.(a as SelectOption);
      }}
      styles={{
        valueContainer: (base) => ({
          ...base,
          overflowX: "scroll",
          flexWrap: "unset",
          "::-webkit-scrollbar": {
            display: "none",
          },
        }),
        multiValue: (base) => ({
          ...base,
          flex:
            selectedMultipleOptionsValue?.length &&
            selectedMultipleOptionsValue?.length >= 2
              ? "1 0 auto"
              : "",
        }),
      }}
    />
  );
}

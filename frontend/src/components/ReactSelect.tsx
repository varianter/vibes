import React from "react";
import Select, { MultiValue } from "react-select";

export type SelectOption = { value: string; label: string };

export default function ReactSelect({
  options,
  selectedSingleOptionValue,
  selectedMultipleOptionsValue,
  onSingleOptionChange,
  onMultipleOptionsChange,
  isMultipleOptions = false,
}: {
  options: SelectOption[];
  selectedSingleOptionValue?: SelectOption | null;
  selectedMultipleOptionsValue?: MultiValue<SelectOption> | null;
  onSingleOptionChange?: (arg: SelectOption) => void;
  onMultipleOptionsChange?: (arg: MultiValue<SelectOption>) => void;
  isMultipleOptions?: boolean;
}) {
  return (
    <Select
      isMulti={isMultipleOptions}
      options={options}
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
      classNames={{ menu: () => "bg-white overflow-hidden" }}
    />
  );
}

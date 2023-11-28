import React from "react";
import Select from "react-select";

export type SelectOption = { value: string; label: string };

export default function ReactSelect({
  options,
  selectedValue,
  onChange,
  isMultipleOptions = false,
}: {
  options: SelectOption[];
  selectedValue: SelectOption | null;
  onChange: (arg: SelectOption) => void;
  isMultipleOptions?: boolean;
}) {
  return (
    <Select
      isMulti={isMultipleOptions}
      options={options}
      value={selectedValue}
      onChange={(a) => a && onChange(a)}
    />
  );
}

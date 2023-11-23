import React from "react";
import Select from "react-select";

export type SelectOption = { value: string; label: string };

export default function TmpReactSelect({
  options,
  selectedValue,
  onChange,
}: {
  options: SelectOption[];
  selectedValue: SelectOption | null;
  onChange: (arg: SelectOption) => void;
}) {
  return (
    <Select
      options={options}
      value={selectedValue}
      onChange={(a) => a && onChange(a)}
    />
  );
}

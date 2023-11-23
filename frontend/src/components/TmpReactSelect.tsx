import React from "react";
import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

export default function TmpReactSelect() {
  return (
    <Select
      unstyled
      options={options}
      classNames={{
        container: () => "rounded-lg border border-primary pl-2", //Styles the entire input field
        dropdownIndicator: () => "text-primary hover:bg-secondary h-", //Styles the dropdown icon

        control: (state) => (state.isFocused ? "" : ""),
        placeholder: () => "",
        input: () => "",
        valueContainer: () => "bg-secondary rounded-lg",
        option: () => "hover:bg-primary hover:text-white",

        indicatorSeparator: () => "bg-secondary", //Add color to separator between text and dropdown icon
        singleValue: () => "text-primary", //Add color to selected text
      }}
    />
  );
}

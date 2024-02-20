import Select, {
  CSSObjectWithLabel,
  MultiValue,
  SingleValue,
  StylesConfig,
  createFilter,
} from "react-select";
import CreatableSelect from "react-select/creatable";
import { OptionalTypeNode } from "typescript";

export type SelectOption = { value: string | number; label: string };

export default function ComboBox({
  options,
  selectedSingleOptionValue,
  selectedMultipleOptionsValue,
  onSingleOptionChange,
  onMultipleOptionsChange,
  isMultipleOptions = false,
  isDisabled = false,
  placeHolderText = "Velg...",
  isClearable = false,
  isCreatable = false,
  width = 200,
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
  isCreatable?: boolean;
  width?: number;
}) {
  const customFilter = createFilter({
    matchFrom: "start",
  });

  const selectProps = {
    placeholder: placeHolderText,
    isMulti: isMultipleOptions,
    options: options,
    isDisabled: isDisabled,
    isClearable: isClearable,
    filterOption: customFilter,
    value: isMultipleOptions
      ? selectedMultipleOptionsValue
      : selectedSingleOptionValue,
    onChange: (a: MultiValue<SelectOption> | SingleValue<SelectOption>) => {
      a && isMultipleOptions
        ? onMultipleOptionsChange?.(a as MultiValue<SelectOption>)
        : onSingleOptionChange?.(a as SelectOption);
    },
    styles: {
      valueContainer: (base: any) => ({
        ...base,
        overflowX: "scroll",
        flexWrap: "unset",
        "::-webkit-scrollbar": {
          display: "none",
        },
      }),
      multiValue: (base: any) => ({
        ...base,
        flex:
          selectedMultipleOptionsValue?.length &&
          selectedMultipleOptionsValue?.length >= 2
            ? "1 0 auto"
            : "",
      }),

      control: (base: CSSObjectWithLabel) => ({
        ...base,
        width,
      }),
    },
  };
  if (!isCreatable) return <Select {...selectProps} />;
  else
    return (
      <CreatableSelect
        {...selectProps}
        formatCreateLabel={(inputText: string) => `Legg til "${inputText}"`}
      />
    );
}

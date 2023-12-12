import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { useContext } from "react";
import Select, { MultiValue, SingleValue, createFilter } from "react-select";
import CreatableSelect from "react-select/creatable";

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
}) {
  const { setCloseModalOnBackdropClick } = useContext(FilteredContext);
  const customFilter = createFilter({
    matchFrom: "start",
  });

  const selectProps = {
    onFocus: () => setCloseModalOnBackdropClick(false),
    onBlur: () => setCloseModalOnBackdropClick(true),
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

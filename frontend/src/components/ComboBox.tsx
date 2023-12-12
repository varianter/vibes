import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { useContext } from "react";
import Select, { MultiValue, createFilter } from "react-select";
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

  if (!isCreatable) {
    return (
      <Select
        onFocus={() => setCloseModalOnBackdropClick(false)}
        onBlur={() => setCloseModalOnBackdropClick(true)}
        placeholder={placeHolderText}
        isMulti={isMultipleOptions}
        options={options}
        isDisabled={isDisabled}
        isClearable={isClearable}
        filterOption={customFilter}
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
  } else {
    return (
      <CreatableSelect
        onFocus={() => setCloseModalOnBackdropClick(false)}
        onBlur={() => setCloseModalOnBackdropClick(true)}
        placeholder={placeHolderText}
        isMulti={isMultipleOptions}
        options={options}
        isDisabled={isDisabled}
        isClearable={isClearable}
        filterOption={customFilter}
        formatCreateLabel={(inputText) => `Legg til "${inputText}"`}
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
}

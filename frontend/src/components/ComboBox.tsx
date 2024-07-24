import { Plus } from "react-feather";
import Select, {
  CSSObjectWithLabel,
  MultiValue,
  SingleValue,
  createFilter,
  components,
  GroupBase,
  SelectInstance,
  MenuListProps,
} from "react-select";
import CreatableSelect from "react-select/creatable";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";
import { useRef, useState } from "react";

export type SelectOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

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

  const ref =
    useRef<SelectInstance<SelectOption, true, GroupBase<SelectOption>>>(null);

  const { primary, black } = resolveConfig(tailwindConfig).theme.colors;

  const [inputValue, setInputValue] = useState<string>("");

  function onChange(
    event: MultiValue<SelectOption> | SingleValue<SelectOption>,
  ) {
    const labelValue = (event as any)?.label || "";

    if (isCreatable && !labelValue) {
      ref.current?.onInputFocus({} as any);
      return;
    }

    event && isMultipleOptions
      ? onMultipleOptionsChange?.(event as MultiValue<SelectOption>)
      : onSingleOptionChange?.(event as SelectOption);
  }

  function MenuList(
    props: MenuListProps<SelectOption, boolean, GroupBase<SelectOption>>,
  ) {
    if (!isCreatable || !Array.isArray(props?.children))
      return <components.MenuList {...props} />;

    const menuOptions = props.children.slice(0, props.children.length - 1);
    const createOption = props.children[props.children.length - 1];

    const menuListProps = { ...props, maxHeight: props.maxHeight - 55 };

    const creatableClassName = `sticky w-full bottom-0 pb-1 bg-white ${
      menuOptions.length && "border-t border-black/10 pt-1"
    }`;

    return (
      <>
        <components.MenuList {...menuListProps}>
          {menuOptions}
        </components.MenuList>
        <div className={creatableClassName}>{createOption}</div>
      </>
    );
  }

  const selectProps = {
    ref,
    placeholder: placeHolderText,
    isMulti: isMultipleOptions,
    options: options,
    isDisabled: isDisabled,
    isClearable: isClearable,
    inputValue,
    onInputChange: setInputValue,
    filterOption: customFilter,
    onKeyDown: (e: any) => e.stopPropagation(),
    value: isMultipleOptions
      ? selectedMultipleOptionsValue
      : selectedSingleOptionValue,
    onChange,
    styles: {
      valueContainer: (base: any) => ({
        ...base,
        overflowX: "scroll",
        flexWrap: "unset",
        "::-webkit-scrollbar": {
          display: "none",
        },
      }),
      singleValue: (base: CSSObjectWithLabel) => ({
        ...base,
        color: primary,
        fontWeight: "bold",
        fontSize: "0.875rem",
      }),
      multiValue: (base: CSSObjectWithLabel) => ({
        ...base,
        color: primary,
        fontWeight: "bold",
        fontSize: "0.875rem",
        minWidth: "auto",
        borderRadius: 8,
        flex:
          selectedMultipleOptionsValue?.length &&
          selectedMultipleOptionsValue?.length >= 2
            ? "1 0 auto"
            : "",
      }),
      control: (base: CSSObjectWithLabel, { isDisabled }: any) => ({
        ...base,
        width,
        borderRadius: 8,
        borderColor: !isDisabled ? primary : black,
        "&:hover": {
          borderColor: primary,
          backgroundColor: `${primary}10`,
        },
      }),
      menu: (base: CSSObjectWithLabel) => ({
        ...base,
        width,
        borderRadius: 8,
        padding: "0 0.25rem",
      }),
      option: (base: CSSObjectWithLabel, { isSelected, data }: any) => ({
        ...base,
        color: isSelected ? "white" : data?.disabled ? `${primary}50` : primary,
        fontWeight: "bold",
        fontSize: "0.75rem",
        lineHeight: "1.5rem",
        padding: "0.5rem 0.75rem",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap" as any,
        overflow: "hidden",
        borderRadius: 8,
      }),
      indicatorSeparator: () => ({
        display: "none",
      }),
      dropdownIndicator: (base: any, { selectProps, isDisabled }: any) => ({
        ...base,
        ...(!isDisabled && { color: primary }),
        transition: "all .2s ease",
        transform: selectProps?.menuIsOpen ? "rotate(180deg)" : null,
      }),
      input: (base: CSSObjectWithLabel) => ({
        ...base,
        minWidth: "100%",
        color: primary,
        fontWeight: "bold",
        fontSize: "0.875rem",
      }),
    },
  };
  if (!isCreatable) return <Select {...selectProps} />;
  else
    return (
      <CreatableSelect
        {...selectProps}
        noOptionsMessage={() => "Ingen resultater"}
        components={{ MenuList }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary25: `${primary}25`,
            primary: primary,
          },
        })}
        formatCreateLabel={(inputText: string) => (
          <div className="flex gap-2 items-center rounded-md">
            <Plus size="20" />
            <p className="flex-1 truncate">
              {`Opprett ${inputText && `"${inputText}"`}`}
            </p>
          </div>
        )}
        isValidNewOption={(inputText: string) => inputText.length > 0}
        isOptionDisabled={(option) => !!option?.disabled}
      />
    );
}

import Select, { SingleValue } from "react-select";
import React, { useEffect, useState } from "react";

export default function EditableTableSingleSelectCell<T extends { id: string, name: string }>({
  originalSelection,
  setConsultant,
  isEditing,
  options,
}: {
  originalSelection: T | undefined;
  setConsultant: (selectedOption: T | undefined) => void;
  isEditing: boolean;
  options: T[];
}) {
  const [newSelection, setNewSelection] =
    useState<T | undefined>(originalSelection);

  const [selection, setSelection] = useState<{
    value: string;
    label: string;
  }>({
    value: originalSelection?.id ?? '',
    label: originalSelection?.name ?? '',
  });

  const selectOptions = options.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  useEffect(() => {
    if (isEditing) {
      setSelection({
        value: newSelection?.id ?? '',
        label: newSelection?.name ?? '',
      });
      setConsultant(newSelection);
    }
  }, [newSelection]);

  return (
    <td className="pr-3">
      {isEditing ? (
        <Select
          styles={{
            valueContainer: (provided: any) => ({
              ...provided,
              // Set a maximum height
              overflow: "auto", // Enable scrolling
              maxHeight: "37px",
            }),
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: state.isFocused
                ? "var(--primary, #423D89)"
                : "var(--primary_50, #423D8980)",
              padding: "0.05rem 0.2rem ",
              color: "var(--primary, #423D89)",
              maxHeight: "41px",
              overflow: "auto",
            }),
          }}
          options={selectOptions}
          isMulti={false}
          defaultValue={selection}
          isClearable
          onChange={(
            selOptions: SingleValue<{ value: string; label: string }>,
          ) => {
            if (selOptions) {
              setNewSelection({
                id: selOptions.value,
                name: selOptions.label,
              } as T);
            }
            else {
              setNewSelection(undefined);
              setConsultant(undefined);
            }
          }}
        />
      ) : (
        <p className="normal text-text_light_black">{newSelection?.name}</p>
      )}
    </td>
  );
}

import Select, { SingleValue } from "react-select";

import React, { useEffect, useState } from "react";

export default function EditableTableSelectGradYearCell({
  gradYear,
  setConsultant,
  isEditing,
}: {
  gradYear: number;
  setConsultant: (year: number) => void;
  isEditing: boolean;
}) {
  const [newYear, setNewYear] = useState<number>(gradYear);

  const [selectedValue, setSelectedValue] = useState<
    | {
        value: string;
        label: string;
      }
    | undefined
  >({ value: gradYear?.toString(), label: gradYear?.toString() });

  useEffect(() => {
    if (isEditing) {
      setSelectedValue({
        value: newYear.toString(),
        label: newYear.toString(),
      });
      setConsultant(newYear);
    }
  }, [newYear]);

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
          options={Array.from(
            { length: 50 },
            (_, i) => new Date().getFullYear() - i,
          ).map((year) => ({
            value: year.toString(),
            label: year.toString(),
          }))}
          isMulti={false}
          defaultValue={selectedValue}
          onChange={(
            selOptions: SingleValue<{ value: string; label: string }>,
          ) => {
            if (selOptions) {
              setNewYear(parseInt(selOptions.value));
            }
          }}
        />
      ) : (
        <p className="normal text-text_light_black">{newYear}</p>
      )}
    </td>
  );
}

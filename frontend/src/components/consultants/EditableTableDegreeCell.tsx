import { Degree } from "@/api-types";
import Select, { SingleValue } from "react-select";

import React, { useEffect, useState } from "react";

export default function EditableTableDegreeCell({
  degree,
  setConsultant,
  isEditing,
}: {
  degree: Degree;
  setConsultant: (degree: Degree) => void;
  isEditing: boolean;
}) {
  const [newDegree, setNewDegree] = useState<Degree>(degree);

  const [selectedValue, setSelectedValue] = useState<{
    value: string;
    label: string;
  }>({
    value: Degree[degree],
    label: degree.toString(),
  });

  const selectOption = Object.entries(Degree)
    .filter(([value]) => isNaN(Number(value)))
    .map(([value, label]) => ({
      value: label.toString(),
      label: value.toString(),
    }));

  useEffect(() => {
    if (isEditing) {
      setSelectedValue({
        value: Degree[newDegree],
        label: newDegree.toString(),
      });
      setConsultant(newDegree);
    }
  }, [newDegree]);

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
          options={selectOption}
          isMulti={false}
          defaultValue={selectedValue}
          onChange={(
            selOptions: SingleValue<{ value: string; label: string }>,
          ) => {
            if (selOptions) {
              setNewDegree(Degree[selOptions.value as keyof typeof Degree]);
            }
          }}
        />
      ) : (
        <p className="normal text-text_light_black">{newDegree}</p>
      )}
    </td>
  );
}

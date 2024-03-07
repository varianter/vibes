import { DepartmentReadModel } from "@/api-types";
import Select, { SingleValue } from "react-select";

import React, { useEffect, useState } from "react";

export default function EditableTableSelectDepartmentCell({
  department,
  setConsultant,
  isEditing,
  options,
}: {
  department: DepartmentReadModel;
  setConsultant: (department: DepartmentReadModel) => void;
  isEditing: boolean;
  options: { id: string; name: string }[];
}) {
  const [newDepartment, setNewDepartment] =
    useState<DepartmentReadModel>(department);

  const [selectedValues, setSelectedValues] = useState<{
    value: string;
    label: string;
  }>({
    value: department.id,
    label: department.name,
  });

  const selectOptions = options.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  useEffect(() => {
    if (isEditing) {
      setSelectedValues({
        value: newDepartment.id,
        label: newDepartment.name,
      });
      setConsultant(newDepartment);
    }
  }, [newDepartment]);

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
          defaultValue={selectedValues}
          onChange={(
            selOptions: SingleValue<{ value: string; label: string }>,
          ) => {
            if (selOptions) {
              setNewDepartment({
                id: selOptions.value,
                name: selOptions.label,
              });
            }
          }}
        />
      ) : (
        <p className="normal text-text_light_black">{newDepartment.name}</p>
      )}
    </td>
  );
}

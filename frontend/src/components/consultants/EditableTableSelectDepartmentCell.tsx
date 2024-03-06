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
      setConsultant(newDepartment);
    }
  }, [newDepartment]);

  return (
    <td className="pr-3">
      {isEditing ? (
        <Select
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

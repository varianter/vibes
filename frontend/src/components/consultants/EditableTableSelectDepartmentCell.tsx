import { ConsultantReadModel } from "@/api-types";
import Select, { ActionMeta, MultiValue, SingleValue } from "react-select";

import React, { useEffect, useState } from "react";

export default function EditableTableSelectDepartmentCell({
  consultant,
  setConsultant,
  isEditing,
  field,
  options,
}: {
  consultant: ConsultantReadModel;
  setConsultant: (consultant: ConsultantReadModel) => void;
  isEditing: boolean;
  field: "department";
  options: { id: string; name: string }[];
}) {
  const [editableConsultant, setEditableConsultant] =
    useState<ConsultantReadModel>(consultant);

  const [selectedValues, setSelectedValues] = useState<{
    value: string;
    label: string;
  }>({
    value: consultant[field]?.id,
    label: consultant[field]?.name,
  });

  const selectOptions = options.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  useEffect(() => {
    if (isEditing) {
      setConsultant({ ...consultant, [field]: editableConsultant[field] });
    }
  }, [editableConsultant]);

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
              setEditableConsultant({
                ...consultant,
                [field]: {
                  id: selOptions.value,
                  name: selOptions.label,
                },
              });
            }
          }}
        />
      ) : (
        <p className="normal text-text_light_black">
          {editableConsultant[field].name}
        </p>
      )}
    </td>
  );
}

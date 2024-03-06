import { ConsultantReadModel, Degree } from "@/api-types";
import Select, { ActionMeta, MultiValue, SingleValue } from "react-select";

import React, { useEffect, useState } from "react";

export default function EditableTableDegreeCell({
  consultant,
  setConsultant,
  isEditing,
  field,
}: {
  consultant: ConsultantReadModel;
  setConsultant: (consultant: ConsultantReadModel) => void;
  isEditing: boolean;
  field: "degree";
}) {
  const [editableConsultant, setEditableConsultant] =
    useState<ConsultantReadModel>(consultant);

  const [selectedValue, setSelectedValue] = useState<{
    value: string;
    label: string;
  }>({
    value: Degree[consultant[field]],
    label: consultant[field].toString(),
  });

  const selectOptions = Object.entries(Degree)
    .filter(([value]) => isNaN(Number(value)))
    .map(([value, label]) => ({
      value: label.toString(),
      label: value.toString(),
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
          defaultValue={selectedValue}
          onChange={(
            selOptions: SingleValue<{ value: string; label: string }>,
          ) => {
            if (selOptions) {
              setEditableConsultant({
                ...consultant,
                //@ts-ignore
                [field]: Degree[selOptions.value],
              });
            }
          }}
        />
      ) : (
        <p className="normal text-text_light_black">
          {editableConsultant[field]}
        </p>
      )}
    </td>
  );
}

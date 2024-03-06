import { ConsultantReadModel } from "@/api-types";
import Select, { ActionMeta, MultiValue, SingleValue } from "react-select";

import React, { useEffect, useState } from "react";

export default function EditableTableSelectGradYearCell({
  consultant,
  setConsultant,
  isEditing,
  field,
  options,
}: {
  consultant: ConsultantReadModel;
  setConsultant: (consultant: ConsultantReadModel) => void;
  isEditing: boolean;
  field: "graduationYear";
  options: { value: string; label: string }[];
}) {
  const [editableConsultant, setEditableConsultant] =
    useState<ConsultantReadModel>(consultant);

  const [selectedValue, setSelectedValue] = useState<
    | {
        value: string;
        label: string;
      }
    | undefined
  >(options.find((option) => option.label === consultant[field]?.toString()));

  useEffect(() => {
    if (isEditing) {
      setConsultant({ ...consultant, [field]: editableConsultant[field] });
    }
  }, [editableConsultant]);

  return (
    <td className="pr-3">
      {isEditing ? (
        <Select
          options={options}
          isMulti={false}
          defaultValue={selectedValue}
          onChange={(
            selOptions: SingleValue<{ value: string; label: string }>,
          ) => {
            if (selOptions) {
              setEditableConsultant({
                ...consultant,
                [field]: parseInt(selOptions.value),
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

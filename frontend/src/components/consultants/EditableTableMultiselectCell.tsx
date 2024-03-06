import { ConsultantReadModel } from "@/api-types";
import Select, { MultiValue } from "react-select";

import React, { useEffect, useState } from "react";

export default function EditableTableMultiselectCell({
  consultant,
  setConsultant,
  isEditing,
  field,
  options,
}: {
  consultant: ConsultantReadModel;
  setConsultant: (consultant: ConsultantReadModel) => void;
  isEditing: boolean;
  field: keyof ConsultantReadModel;
  options: { id: string; name: string }[];
}) {
  const [editableConsultant, setEditableConsultant] =
    useState<ConsultantReadModel>(consultant);

  const [selectedValues, setSelectedValues] = useState<
    { value: string; label: string }[]
  >(
    consultant.competences.map((option) => ({
      value: option.id,
      label: option.name,
    })),
  );

  const selectOptions = options.map((option) => ({
    value: option.id,
    label: option.name,
  }));

  useEffect(() => {
    if (isEditing) {
      setSelectedValues(
        editableConsultant.competences.map((option) => ({
          value: option.id,
          label: option.name,
        })),
      );

      setConsultant({ ...consultant, [field]: editableConsultant[field] });
    }
  }, [editableConsultant]);

  const customStyles = {
    valueContainer: (provided: any) => ({
      ...provided,
      maxHeight: "43px", // Set a maximum height
      overflow: "auto", // Enable scrolling
    }),
  };

  return (
    <td className="pr-3">
      {isEditing ? (
        <Select
          styles={customStyles}
          options={selectOptions}
          isMulti={true}
          defaultValue={selectedValues}
          onChange={(
            selOptions: MultiValue<{ value: string; label: string }>,
          ) => {
            if (Array.isArray(selOptions)) {
              setEditableConsultant({
                ...consultant,
                [field]: selOptions.map((option) => ({
                  id: option.value,
                  name: option.label,
                })),
              });
            }
          }}
        />
      ) : (
        <p className="normal text-text_light_black">
          {(editableConsultant[field] as { id: string; name: string }[])
            .map((option) => option.name)
            .join(", ")}
        </p>
      )}
    </td>
  );
}

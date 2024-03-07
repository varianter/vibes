import { Competence, ConsultantReadModel } from "@/api-types";
import Select, { MultiValue } from "react-select";

import React, { useEffect, useState } from "react";

export default function EditableTableCompetencesCell({
  competences,
  setConsultant,
  isEditing,
  options,
}: {
  competences: Competence[];
  setConsultant: (competences: Competence[]) => void;
  isEditing: boolean;
  options: { id: string; name: string }[];
}) {
  const [newCompetences, setNewCompetences] =
    useState<Competence[]>(competences);

  const [selectedValues, setSelectedValues] = useState<
    { value: string; label: string }[]
  >(
    competences.map((option) => ({
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
        newCompetences.map((option) => ({
          value: option.id,
          label: option.name,
        })),
      );
      setConsultant(newCompetences);
    }
  }, [newCompetences]);

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
          isMulti={true}
          defaultValue={selectedValues}
          onChange={(
            selOptions: MultiValue<{ value: string; label: string }>,
          ) => {
            if (Array.isArray(selOptions)) {
              setNewCompetences(
                selOptions.map((option) => ({
                  id: option.value,
                  name: option.label,
                })),
              );
            }
          }}
        />
      ) : (
        <p className="normal text-text_light_black">
          {newCompetences.map((option) => option.name).join(", ")}
        </p>
      )}
    </td>
  );
}

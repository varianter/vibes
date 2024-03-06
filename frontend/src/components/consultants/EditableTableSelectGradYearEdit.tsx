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

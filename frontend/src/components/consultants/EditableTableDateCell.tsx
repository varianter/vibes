"use client";
import { ConsultantReadModel } from "@/api-types";
import React, { useEffect, useState } from "react";

export default function EditableTableDateCell({
  style,
  setConsultant,
  consultant,
  isEditing,
  field,
}: {
  style?: string;
  setConsultant: (consultant: ConsultantReadModel) => void;
  consultant: ConsultantReadModel;
  isEditing: boolean;
  field: "startDate" | "endDate";
}) {
  const [newDate, setNewDate] = useState<Date | undefined>(consultant[field]);

  const [editableConsultant, setEditableConsultant] =
    useState<ConsultantReadModel>(consultant);

  useEffect(() => {
    if (isEditing) {
      setConsultant({ ...consultant, [field]: editableConsultant[field] });
    }
  }, [editableConsultant]);

  return (
    <td className="pr-3">
      {isEditing ? (
        <input
          className="w-full h-7 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          type="date"
          value={newDate ? new Date(newDate).toISOString().split("T")[0] : ""}
          onChange={(e) => {
            setNewDate(e.target.value ? new Date(e.target.value) : undefined);
            setEditableConsultant({
              ...consultant,
              [field]: e.target.value ? e.target.value : undefined,
            });
          }}
        />
      ) : (
        <p className={style ? style : "normal text-text_light_black"}>
          {newDate
            ? new Date(newDate).toLocaleDateString(undefined, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "-"}
        </p>
      )}
    </td>
  );
}

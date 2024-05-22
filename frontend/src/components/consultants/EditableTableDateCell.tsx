"use client";
import { ConsultantReadModel } from "@/api-types";
import React, { useEffect, useState } from "react";

export default function EditableTableDateCell({
  style,
  setConsultant,
  date,
  isEditing,
}: {
  style?: string;
  setConsultant: (date: Date | undefined) => void;
  date: Date | undefined;
  isEditing: boolean;
}) {
  const [newDate, setNewDate] = useState<Date | undefined>(date);

  useEffect(() => {
    if (isEditing) {
      setConsultant(newDate);
    }
  }, [newDate]);

  return (
    <td className="pr-3">
      {isEditing ? (
        <input
          className="w-full py-2 px-3 border border-primary_50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
          type="date"
          value={newDate ? new Date(newDate).toISOString().split("T")[0] : ""}
          onChange={(e) => {
            setNewDate(e.target.value ? new Date(e.target.value) : undefined);
          }}
        />
      ) : (
        <p className={style ? style : "normal text-text_light_black"}>
          {newDate
            ? new Date(newDate).toLocaleDateString("nb-No", {
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

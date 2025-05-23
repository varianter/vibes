"use client";
import React, { useEffect, useState } from "react";

export default function EditableTableNumberCell({
  number,
  setConsultant,
  isEditing,
}: {
  number: number;
  setConsultant: (number: number) => void;
  isEditing: boolean;
}) {
  const [newValue, setNewValue] = useState<number>(number);

  useEffect(() => {
    if (isEditing) {
      setConsultant(newValue);
    }
  }, [newValue]);

  return (
    <td className="pr-3">
      {isEditing ? (
        <input
          className="w-full py-2 px-3 border border-primary_50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
          type="number"
          min="0"
          value={newValue}
          onChange={(e) => setNewValue(Number(e.target.value))}
        />
      ) : (
        <p className="normal text-text_light_black float-right">
          {newValue.toLocaleString("no-nb")}
        </p>
      )}
    </td>
  );
}

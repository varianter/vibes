"use client";
import React, { useEffect, useState } from "react";

export default function EditableTableTextCell({
  text,
  setConsultant,
  isEditing,
  style,
}: {
  text: string;
  setConsultant: (text: string) => void;
  isEditing: boolean;
  style?: string;
}) {
  const [newText, setNewText] = useState<string>(text);

  useEffect(() => {
    if (isEditing) {
      setConsultant(newText);
    }
  }, [newText]);

  return (
    <td className="pr-3">
      {isEditing ? (
        <input
          className="w-full py-2 px-3 border border-primary_50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
      ) : (
        <p className={style ? style : "normal text-text_light_black"}>
          {newText}
        </p>
      )}
    </td>
  );
}

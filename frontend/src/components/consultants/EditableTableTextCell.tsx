"use client";
import { ConsultantReadModel } from "@/api-types";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import React, { useContext, useEffect, useRef, useState } from "react";

export default function EditableTableTextCell({
  consultant,
  setConsultant,
  isEditing,
  field,
  style,
}: {
  consultant: ConsultantReadModel;
  setConsultant: (consultant: ConsultantReadModel) => void;
  isEditing: boolean;
  field: keyof ConsultantReadModel;
  style?: string;
}) {
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
          type="text"
          value={editableConsultant[field] as string}
          onChange={(e) =>
            setEditableConsultant({ ...consultant, [field]: e.target.value })
          }
        />
      ) : (
        <p className={style ? style : "normal text-text_light_black"}>
          {editableConsultant[field] as string}
        </p>
      )}
    </td>
  );
}

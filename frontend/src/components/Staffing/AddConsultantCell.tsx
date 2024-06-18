import React, { ReactElement, useState } from "react";
import { Plus } from "react-feather";
import { SelectOption } from "@/components/ComboBox";
import { useModal } from "@/hooks/useModal";

import { AddConsultantModal } from "./AddConsultantModal";
import { ConsultantReadModel } from "@/api-types";

export function AddConsultantCell(props: {
  onAddConsultant: (option: SelectOption) => void;
  consultantList: ConsultantReadModel[];
}): ReactElement {
  const [isAddStaffingHovered, setIsAddConsultantHovered] = useState(false);
  const [addNewConsultant, setAddNewConsultant] = useState<boolean>(false);

  function closeAddConsultant() {
    setAddNewConsultant(false);
  }

  return (
    <>
      <td colSpan={2}>
        {!addNewConsultant && (
          <button
            onClick={() => setAddNewConsultant(true)}
            className="flex flex-row items-center ml-3"
            onMouseEnter={() => setIsAddConsultantHovered(true)}
            onMouseLeave={() => setIsAddConsultantHovered(false)}
          >
            <span
              className={`w-8 h-8 flex justify-center items-center rounded-lg bg-primary/0 ${
                isAddStaffingHovered && "bg-primary/10"
              }`}
            >
              <Plus size={16} className="text-primary" />
            </span>
            <p className="small text-primary text-start small pl-1 py-50">
              Legg til konsulent
            </p>
          </button>
        )}
        {addNewConsultant && (
          <AddConsultantModal
            onAddConsultant={props.onAddConsultant}
            consultantList={props.consultantList}
            closeAddConsultant={closeAddConsultant}
          />
        )}
      </td>
    </>
  );
}

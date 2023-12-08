import React, { ReactElement, useState } from "react";
import { Plus } from "react-feather";
import { SelectOption } from "@/components/ComboBox";
import { useModal } from "@/hooks/useModal";

import { Consultant } from "@/types";
import { AddConsultantModal } from "./AddConsultantModal";

export function AddConsultantCell(props: {
  onAddConsultant: (option: SelectOption) => void;
  consultantList: Consultant[];
}): ReactElement {
  const [isAddStaffingHovered, setIsAddConsultantHovered] = useState(false);

  const { closeModal, openModal, modalRef } = useModal({
    closeOnBackdropClick: false,
  });

  return (
    <>
      <td colSpan={2}>
        <AddConsultantModal
          closeConsultantModal={closeModal}
          easyModalRef={modalRef}
          onAddConsultant={props.onAddConsultant}
          consultantList={props.consultantList}
        />
        <button
          onClick={openModal}
          className="flex flex-row items-center gap-2"
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
          <p className="small text-primary text-start small ">
            Legg til konsulent
          </p>
        </button>
      </td>
    </>
  );
}

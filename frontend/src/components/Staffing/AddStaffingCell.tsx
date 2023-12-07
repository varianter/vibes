import React, { ReactElement, useContext, useState } from "react";
import { useModal } from "@/hooks/useModal";
import { AddEngagementForm } from "@/components/Staffing/AddEngagementForm";
import { Plus } from "react-feather";
import { Consultant } from "@/types";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";

export function AddStaffingCell({
  consultant,
}: {
  consultant: Consultant;
}): ReactElement {
  const { closeModalOnBackdropClick } = useContext(FilteredContext);
  const { closeModal, openModal, modalRef } = useModal({
    closeOnBackdropClick: closeModalOnBackdropClick,
  });
  const [isAddStaffingHovered, setIsAddStaffingHovered] = useState(false);

  return (
    <>
      <td className={`${"border-l-secondary border-l-2"}`}></td>
      <td>
        <AddEngagementForm
          closeEngagementModal={closeModal}
          easyModalRef={modalRef}
          consultant={consultant}
        />

        <button
          onClick={openModal}
          className="flex flex-row items-center gap-2"
          onMouseEnter={() => setIsAddStaffingHovered(true)}
          onMouseLeave={() => setIsAddStaffingHovered(false)}
        >
          <span
            className={`w-8 h-8 flex justify-center items-center rounded bg-primary/0 ${
              isAddStaffingHovered && "bg-primary/10"
            }`}
          >
            <Plus size={16} className="text-primary" />
          </span>

          <p className="small text-primary">Legg til bemanning</p>
        </button>
      </td>
    </>
  );
}

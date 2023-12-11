import React, { ReactElement, useContext, useState } from "react";
import { useModal } from "@/hooks/useModal";
import { AddEngagementForm } from "@/components/Staffing/AddEngagementForm";
import { Plus } from "react-feather";
import { ConsultantReadModel, ProjectWithCustomerModel } from "@/api-types";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
import { AddEngagementHoursModal } from "./AddEngagementHoursModal";

export function AddStaffingCell({
  consultant,
}: {
  consultant: ConsultantReadModel;
}): ReactElement {
  const { closeModalOnBackdropClick } = useContext(FilteredContext);
  const {
    closeModal: closeAddEngagementModal,
    openModal: openAddEngagementModal,
    modalRef: addEngagementModalRef,
  } = useModal({
    closeOnBackdropClick: closeModalOnBackdropClick,
  });

  const {
    closeModal: closeStaffEngagementModal,
    openModal: openStaffEngagementModal,
    modalRef: staffEngagementModalRef,
  } = useModal({
    closeOnBackdropClick: closeModalOnBackdropClick,
  });

  const [isAddStaffingHovered, setIsAddStaffingHovered] = useState(false);

  const [selectedConsultants, setSelectedConsultants] =
    useState<ConsultantReadModel[]>();
  const [selectedProject, setSelectedProject] =
    useState<ProjectWithCustomerModel>();

  const { setIsDisabledHotkeys } = useContext(FilteredContext);

  function handleNewEngagement(
    project: ProjectWithCustomerModel,
    consultantList: ConsultantReadModel[],
  ) {
    closeAddEngagementModal();
    setSelectedConsultants(consultantList);
    setSelectedProject(project);
    openStaffEngagementModal();
  }

  return (
    <>
      <td className={`${"border-l-secondary border-l-2"}`}></td>
      <td>
        <button
          onClick={() => {
            openAddEngagementModal();
            setIsDisabledHotkeys(true);
          }}
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

        <AddEngagementForm
          closeEngagementModal={handleNewEngagement}
          easyModalRef={addEngagementModalRef}
          consultant={consultant}
        />

        <AddEngagementHoursModal
          modalRef={staffEngagementModalRef}
          project={selectedProject}
          chosenConsultants={selectedConsultants ?? []}
        />
      </td>
    </>
  );
}

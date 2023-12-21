"use client";
import { useModal } from "@/hooks/useModal";
import { AddEngagementForm } from "./Staffing/AddEngagementForm";
import { AddEngagementHoursModal } from "./Staffing/AddEngagementHoursModal/AddEngagementHoursModal";
import { useState } from "react";
import { ConsultantReadModel, ProjectWithCustomerModel } from "@/api-types";
import { Plus } from "react-feather";
import ActionButton from "./Buttons/ActionButton";

export default function AddEngagementButton() {
  const {
    closeModal: closeAddEngagementModal,
    openModal: openAddEngagementModal,
    modalRef: addEngagementModalRef,
  } = useModal({
    closeOnBackdropClick: false,
  });

  const {
    closeModal: closeStaffEngagementModal,
    openModal: openStaffEngagementModal,
    modalRef: staffEngagementModalRef,
  } = useModal({
    closeOnBackdropClick: false,
  });

  const [selectedConsultants, setSelectedConsultants] =
    useState<ConsultantReadModel[]>();
  const [selectedProject, setSelectedProject] =
    useState<ProjectWithCustomerModel>();

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
      <ActionButton
        onClick={openAddEngagementModal}
        className="flex flex-row items-center gap-2"
        variant={"primary"}
        iconLeft={<Plus />}
      >
        <p>Nytt engasjement</p>
      </ActionButton>
      <AddEngagementForm
        closeEngagementModal={handleNewEngagement}
        easyModalRef={addEngagementModalRef}
      />

      <AddEngagementHoursModal
        modalRef={staffEngagementModalRef}
        project={selectedProject}
        chosenConsultants={selectedConsultants ?? []}
      />
    </>
  );
}

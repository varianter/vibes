"use client";
import { useModal } from "@/hooks/useModal";
import { AddEngagementForm } from "./Staffing/AddEngagementForm";
import { AddEngagementHoursModal } from "./Staffing/AddEngagementHoursModal/AddEngagementHoursModal";
import { useContext, useState } from "react";
import { ConsultantReadModel, ProjectWithCustomerModel } from "@/api-types";
import { FilteredContext } from "@/hooks/ConsultantFilterProvider";
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
      <ActionButton
        onClick={() => {
          openAddEngagementModal();
          setIsDisabledHotkeys(true);
        }}
        className="flex flex-row items-center gap-2"
        variant={"primary"}
        iconLeft={<Plus />}
      >
        <p>Nytt engasjement</p>
      </ActionButton>
      <AddEngagementForm
        closeEngagementModal={handleNewEngagement}
        easyModalRef={addEngagementModalRef}
        consultant={undefined}
      />

      <AddEngagementHoursModal
        modalRef={staffEngagementModalRef}
        project={selectedProject}
        chosenConsultants={selectedConsultants ?? []}
      />
    </>
  );
}

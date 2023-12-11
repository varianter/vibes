import React, { RefObject } from "react";
import BaseModal from "./BaseModal";
import { Check } from "react-feather";
import ActionButton from "../Buttons/ActionButton";
import { LargeModalHeader } from "./LargeModalHeader";
import { ProjectWithCustomerModel } from "@/api-types";

export interface EasyModalProps {
  children: React.ReactNode;
  onClose?: () => void;
  modalRef: RefObject<HTMLDialogElement>;
  showCloseButton?: true;
  project?: ProjectWithCustomerModel;
}

export function LargeModal(props: EasyModalProps) {
  const { children, onClose, modalRef, showCloseButton, project } = props;

  const dialogElement = modalRef?.current;

  function handleClose() {
    onClose?.();
    dialogElement?.close();
  }

  return (
    <BaseModal modalRef={modalRef} classNames="h-[640px] ">
      <div className="flex flex-col h-full">
        <LargeModalHeader project={project} />
        <div className="flex-1">{children}</div>
        <div className="flex justify-end">
          {showCloseButton && (
            <ActionButton
              onClick={handleClose}
              variant={"primary"}
              iconLeft={<Check />}
              iconBtn
            >
              Ferdig
            </ActionButton>
          )}
        </div>
      </div>
    </BaseModal>
  );
}

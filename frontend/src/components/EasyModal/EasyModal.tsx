"use client";

import { RefObject } from "react";
import BaseModal from "../BaseModal";
import { Check } from "react-feather";
import { EasyModalHeader } from "./EasyModalHeader";
import ActionButton from "../Buttons/ActionButton";

export interface EasyModalProps {
  children: React.ReactNode;
  onClose?: () => void;
  onSave?: () => void;
  modalRef: RefObject<HTMLDialogElement>;
  showCloseButton?: true;
  title: string;
}

function EasyModal(props: EasyModalProps) {
  const { children, onClose, onSave, modalRef, showCloseButton, title } = props;

  const dialogElement = modalRef?.current;

  function handleClose() {
    onClose?.();
    dialogElement?.close();
  }

  function handleSave() {
    onSave?.();
    dialogElement?.close();
  }

  return (
    <BaseModal modalRef={modalRef}>
      <div className="w-[332px]">
        <EasyModalHeader
          title={title}
          handleClose={handleClose}
          showCloseButton={showCloseButton}
        />

        <div className="space-y-2">{children}</div>

        <div className="space-y-2 space-x-2">
          <ActionButton
            variant="primary"
            onClick={handleSave}
            small
            fullWidth
            iconLeft={<Check />}
          >
            Lagre
          </ActionButton>
        </div>
      </div>
    </BaseModal>
  );
}

export default EasyModal;

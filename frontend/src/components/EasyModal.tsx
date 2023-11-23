"use client";

import { RefObject } from "react";
import BaseModal from "./BaseModal";
import { Check, X, XCircle } from "react-feather";
import { EasyModalHeader } from "./EasyModal/EasyModalHeader";
import { EasyModalContent } from "./EasyModal/EasyModalContent";
import ActionButton from "./Buttons/ActionButton";
import IconActionButton from "./Buttons/IconActionButton";

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

        <div className="space-y-4">{children}</div>

        <div className="space-y-4">
          <IconActionButton
            variant="primary"
            onClick={handleSave}
            icon={<Check />}
          />
          <ActionButton
            variant="primary"
            onClick={handleSave}
            fullWidth
            iconLeft={<Check size={24} />}
          >
            Lagre
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={handleSave}
            fullWidth
            iconRight={<XCircle />}
          >
            Cancel
          </ActionButton>
          <ActionButton
            variant="terniary"
            onClick={handleSave}
            fullWidth
            small
            iconRight={<X />}
          >
            Exit
          </ActionButton>
        </div>
      </div>
    </BaseModal>
  );
}

export default EasyModal;

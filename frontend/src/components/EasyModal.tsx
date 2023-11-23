"use client";

import { RefObject } from "react";
import BaseModal from "./BaseModal";
import { AlertOctagon, Check, Plus, X } from "react-feather";
import { EasyModalHeader } from "./EasyModal/EasyModalHeader";
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
            variant="secondary"
            onClick={handleSave}
            small
            icon={<Plus />}
          />
          <IconActionButton
            variant="primary"
            onClick={handleSave}
            icon={<Check />}
          />
          <ActionButton
            variant="primary"
            onClick={handleSave}
            iconLeft={<Plus />}
          >
            Button
          </ActionButton>
          <ActionButton
            variant="primary"
            onClick={handleSave}
            iconLeft={<Plus />}
            iconRight={<Plus />}
          >
            Button
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={handleSave}
            iconRight={<AlertOctagon />}
          >
            Cancel
          </ActionButton>
          <ActionButton
            variant="terniary"
            onClick={handleSave}
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

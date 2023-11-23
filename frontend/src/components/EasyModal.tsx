"use client";

import { RefObject } from "react";
import BaseModal from "./BaseModal";
import { Check, Plus } from "react-feather";
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

        <div className="space-y-2">{children}</div>

        <div className="space-y-2 space-x-2">
          <ActionButton variant="primary" onClick={handleSave}>
            Button
          </ActionButton>
          <ActionButton variant="secondary" onClick={handleSave}>
            Button
          </ActionButton>
          <ActionButton variant="terniary" onClick={handleSave}>
            Button
          </ActionButton>
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
          <ActionButton variant="primary" onClick={handleSave}>
            Button
          </ActionButton>
          <ActionButton variant="secondary" onClick={handleSave}>
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
            iconLeft={<Plus />}
            iconRight={<Plus />}
          >
            Button
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={handleSave}
            iconLeft={<Plus />}
            iconRight={<Plus />}
            small
          >
            Button
          </ActionButton>
          <ActionButton
            variant="terniary"
            onClick={handleSave}
            small
            iconRight={<Plus />}
            iconLeft={<Plus />}
          >
            Button
          </ActionButton>
          <ActionButton
            variant="primary"
            onClick={handleSave}
            small
            iconRight={<Plus />}
            iconLeft={<Plus />}
          >
            Button
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={handleSave}
            iconLeft={<Plus />}
            fullWidth
            small
          >
            Button
          </ActionButton>
          <ActionButton
            variant="terniary"
            onClick={handleSave}
            small
            fullWidth
            iconLeft={<Plus />}
          >
            Button
          </ActionButton>
          <ActionButton
            variant="primary"
            onClick={handleSave}
            small
            fullWidth
            iconLeft={<Plus />}
          >
            Button
          </ActionButton>
        </div>
      </div>
    </BaseModal>
  );
}

export default EasyModal;

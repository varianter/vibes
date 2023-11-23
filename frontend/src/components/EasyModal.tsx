"use client";

import { RefObject } from "react";
import RightCloseButton from "./RightCloseButton";
import BaseModal from "./BaseModal";
import PrimaryButton from "./PrimaryButton";
import { Check } from "react-feather";

export interface EasyModalProps {
  children: React.ReactNode;
  onClose?: () => void;
  onSave?: () => void;
  modalRef: RefObject<HTMLDialogElement>;
  showCloseButton?: boolean;
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
      <div className="w-[332px] flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-row justify-between items-center">
            <h2>{title}</h2>
            {showCloseButton && <RightCloseButton onClick={handleClose} />}
          </div>
          {children}
        </div>
        <PrimaryButton onClick={handleSave} fullWidth>
          <span className="text-white normal-semibold">Legg til</span>
        </PrimaryButton>
      </div>
    </BaseModal>
  );
}

export default EasyModal;

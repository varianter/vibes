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
      <div className="w-[299px] md:inset-0 h-[calc(100%-1rem)] max-h-full relative max-w-2xl">
        <div className="w-full h-10 justify-between items-center inline-flex">
          <div className="p-2 text-zinc-800 text-xl font-normal leading-normal">
            <h2>{title}</h2>
          </div>
          {showCloseButton && (
            <div className="p-2 rounded-lg justify-center items-center gap-2 flex">
              <RightCloseButton onClick={handleClose} />
            </div>
          )}
        </div>

        <div className="p-2 md:p-5 space-y-4 z-10">{children}</div>

        <div className="p-2 md:p-5 space-y-4 z-10">
          <PrimaryButton onClick={handleSave} fullWidth>
            <Check className="text-white" size={24} />
            <span className="text-white text-sm">Lagre</span>
          </PrimaryButton>
        </div>
      </div>
    </BaseModal>
  );
}

export default EasyModal;

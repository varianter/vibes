"use client";

import { RefObject } from "react";
import RightCloseButton from "./RightCloseButton";
import BaseModal from "./BaseModal";

export interface SmallModalProps {
  children: React.ReactNode;
  onClose?: () => void;
  modalRef: RefObject<HTMLDialogElement>;
  showCloseButton?: boolean;
  title: string;
}

function SmallModal(props: SmallModalProps) {
  const { children, onClose, modalRef, showCloseButton, title } = props;

  const dialogElement = modalRef?.current;

  function handleClose() {
    onClose?.();
    dialogElement?.close();
  }

  return (
    <BaseModal modalRef={modalRef}>
      <div className="p-4 w-full md:inset-0 h-[calc(100%-1rem)] max-h-full relative max-w-2xl rounded-lg ">
        <div className="w-[368px] h-10 justify-between items-center inline-flex">
          <div className="text-zinc-800 text-xl">
            <h2>{title}</h2>
          </div>
          {showCloseButton && (
            <div className="p-2 rounded-lg justify-center items-center gap-2 flex">
              <div className="w-6 h-6 relative" />
              <RightCloseButton onClick={handleClose} />
            </div>
          )}
        </div>

        <div className="p-4 md:p-5 space-y-4 z-10">{children}</div>
      </div>
    </BaseModal>
  );
}

export default SmallModal;

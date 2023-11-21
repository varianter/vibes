"use client";

import { RefObject } from "react";

export interface BaseModalProps {
  children: React.ReactNode;
  onClose?: () => void;
  modalRef: RefObject<HTMLDialogElement>;
}

function BaseModal(props: BaseModalProps) {
  const { children, onClose, modalRef } = props;

  const dialogElement = modalRef?.current;

  function handleClose() {
    onClose?.();
    dialogElement?.close();
  }

  return (
    <dialog ref={modalRef}>
      {children}
      <button onClick={handleClose}>Close</button>
    </dialog>
  );
}

export default BaseModal;

"use client";

import { RefObject } from "react";

export interface BaseModalProps {
  children: React.ReactNode;
  modalRef: RefObject<HTMLDialogElement>;
  classNames?: string;
}

function BaseModal(props: BaseModalProps) {
  const { children, modalRef, classNames } = props;

  return (
    <dialog ref={modalRef} className={`rounded-lg p-4 ${classNames}`}>
      {children}
    </dialog>
  );
}

export default BaseModal;

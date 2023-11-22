"use client";

import { RefObject } from "react";

export interface BaseModalProps {
  children: React.ReactNode;
  modalRef: RefObject<HTMLDialogElement>;
}

function BaseModal(props: BaseModalProps) {
  const { children, modalRef } = props;

  return <dialog ref={modalRef}>{children}</dialog>;
}

export default BaseModal;

"use client";

import { RefObject } from "react";
import BaseModal from "./BaseModal";
import { EasyModalHeader } from "./EasyModalHeader";

export interface EasyModalProps {
  children: React.ReactNode;
  onClose?: () => void;
  onSave?: () => void;
  modalRef: RefObject<HTMLDialogElement>;
  showCloseButton?: true;
  title: string;
  width?: string;
  height?: string;
  classNames?: string;
}

function EasyModal(props: EasyModalProps) {
  const {
    children,
    onClose,
    modalRef,
    showCloseButton,
    title,
    width,
    height,
    classNames = "",
  } = props;

  const dialogElement = modalRef?.current;

  function handleClose() {
    onClose?.();
    dialogElement?.close();
  }

  const dialogBaseWidth = width ? `w-[${width}]` : "w-[331px]";
  const dialogBaseHeight = height ? `w-[${height}]` : "w-[232px]";

  return (
    <BaseModal modalRef={modalRef} classNames={classNames}>
      <div className={`${dialogBaseWidth} ${dialogBaseHeight}`}>
        <EasyModalHeader
          title={title}
          handleClose={handleClose}
          showCloseButton={showCloseButton}
        />

        <div className="space-y-2 z-10">{children}</div>
      </div>
    </BaseModal>
  );
}

export default EasyModal;

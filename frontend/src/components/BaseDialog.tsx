"use client";

import { RefObject } from "react";

export interface BaseDialogProps {
  children: React.ReactNode;
  onClose?: () => void;
  dialogRef: RefObject<HTMLDialogElement>;
}

function BaseDialog(props: BaseDialogProps) {
  const { children, onClose, dialogRef } = props;

  const dialogElement = dialogRef?.current;

  function handleClose() {
    onClose?.();
    dialogElement?.close();
  }

  return (
    <dialog ref={dialogRef}>
      {children}
      <button onClick={handleClose}>Close</button>
    </dialog>
  );
}

export default BaseDialog;

"use client";

import { Ref } from "react";

export interface BaseDialogProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  dialogRef: Ref<HTMLDialogElement>;
}

function BaseDialog(props: BaseDialogProps) {
  const { title, children, onClose, dialogRef } = props;

  const dialogElement: HTMLDialogElement = dialogRef && dialogRef.current;

  function handleClose() {
    onClose?.();
    dialogElement.close();
  }

  return (
    <dialog ref={dialogRef}>
      {children}
      <button onClick={handleClose}>Close</button>
    </dialog>
  );
}

export default BaseDialog;

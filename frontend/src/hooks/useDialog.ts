import { useRef } from "react";

export function useDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialog = dialogRef.current;
  const dialogNode = dialog !== null;

  function openDialog() {
    dialogNode && dialog.show();
  }

  return {
    openDialog,
    dialogRef,
  };
}

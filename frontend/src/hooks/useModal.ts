import { useEffect, useRef } from "react";
import { isClickOutsideElement } from "./useOutsideClick";

export function useModal(options?: { closeOnBackdropClick?: boolean }) {
  const { closeOnBackdropClick = true } = options || {};

  const modalRef = useRef<HTMLDialogElement>(null);
  const modal = modalRef.current;
  const modalNode = modal !== null;

  function openModal() {
    modalNode && modal.showModal();
  }

  useEffect(() => {
    function handleBackDropClick(e: MouseEvent) {
      const clickIsOutside = isClickOutsideElement(e, modal);

      if (clickIsOutside) {
        modal?.close();
      }
    }

    if (modal && closeOnBackdropClick) {
      modal.addEventListener("click", handleBackDropClick);

      return () => {
        modal.removeEventListener("click", handleBackDropClick);
      };
    }
  }, [modal, closeOnBackdropClick]);

  return {
    modalRef,
    openModal,
  };
}

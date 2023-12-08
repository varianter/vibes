import { useLayoutEffect, useRef } from "react";
import { isClickOutsideElement } from "./useOutsideClick";

export function useModal(options?: { closeOnBackdropClick?: boolean }) {
  const { closeOnBackdropClick } = options || { closeOnBackdropClick: true };

  const modalRef = useRef<HTMLDialogElement>(null);
  const modal = modalRef.current;
  const modalNode = modal !== null;

  function openModal() {
    modalNode && modal.showModal();
  }

  function closeModal() {
    modalNode && modal.close();
  }

  useLayoutEffect(() => {
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
    closeModal,
  };
}

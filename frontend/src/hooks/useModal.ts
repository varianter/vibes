import { useLayoutEffect, useRef } from "react";
import { isClickOutsideElement } from "./useOutsideClick";

export function useModal(options?: { closeOnBackdropClick?: boolean }) {
  const { closeOnBackdropClick } = options || { closeOnBackdropClick: true };

  const modalRef = useRef<HTMLDialogElement>(null);

  function openModal() {
    modalRef.current?.showModal();
  }

  function closeModal() {
    modalRef.current?.close();
  }

  useLayoutEffect(() => {
    const modal = modalRef.current;

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
  }, [closeOnBackdropClick]);

  return {
    modalRef,
    openModal,
    closeModal,
  };
}

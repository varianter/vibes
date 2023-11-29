import { useEffect, useRef } from "react";
import { isClickOutsideElement } from "./useOutsideClick";

export function useModal(options?: { closeOnBackdropClick?: true }) {
  const { closeOnBackdropClick } = options || {};

  const modalRef = useRef<HTMLDialogElement>(null);
  const modal = modalRef.current;
  const modalNode = modal !== null;

  function openModal() {
    modalNode && modal.showModal();
  }

  function closeModal() {
    modalNode && modal.close();
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
    closeModal,
  };
}

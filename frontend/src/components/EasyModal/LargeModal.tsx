import React from "react";
import BaseModal from "../BaseModal";
import { X } from "react-feather";
import ActionButton from "../Buttons/ActionButton";
import { useModal } from "@/hooks/useModal";

export function LargeModal() {
  const { modalRef, openModal, closeModal } = useModal();

  return (
    <>
      <BaseModal modalRef={modalRef} classNames="w-full max-w-screen-md">
        <div className="flex flex-row justify-between items-center">
          <h2>Design Bistand</h2>

          <ActionButton
            onClick={closeModal}
            variant={"terniary"}
            iconRight={<X />}
          >
            Lukk
          </ActionButton>
        </div>
      </BaseModal>
      <ActionButton variant="secondary" onClick={openModal}>
        Large Modal
      </ActionButton>
    </>
  );
}

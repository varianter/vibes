"use client";

import BaseModal from "../BaseModal";
import { Check, Plus } from "react-feather";
import { EasyModalHeader } from "./EasyModalHeader";
import ActionButton from "../Buttons/ActionButton";
import IconActionButton from "../Buttons/IconActionButton";
import { useModal } from "@/hooks/useModal";

function ButtonExampleModal() {
  const { modalRef, openModal, closeModal } = useModal();

  const dialogElement = modalRef?.current;

  function handleClose() {
    dialogElement?.close();
  }

  function handleSave() {
    dialogElement?.close();
  }

  return (
    <>
      <BaseModal modalRef={modalRef}>
        <div className="w-[332px]">
          <EasyModalHeader
            title="Button Examples"
            handleClose={handleClose}
            showCloseButton={true}
          />

          <div className="space-y-2 space-x-2">
            <ActionButton variant="primary" onClick={handleSave}>
              Button
            </ActionButton>
            <ActionButton variant="secondary" onClick={handleSave}>
              Button
            </ActionButton>
            <ActionButton variant="terniary" onClick={handleSave}>
              Button
            </ActionButton>
            <IconActionButton
              variant="secondary"
              onClick={handleSave}
              small
              icon={<Plus />}
            />
            <IconActionButton
              variant="primary"
              onClick={handleSave}
              icon={<Check />}
            />
            <ActionButton
              variant="primary"
              onClick={handleSave}
              iconLeft={<Plus />}
            >
              Button
            </ActionButton>
            <ActionButton variant="primary" onClick={handleSave}>
              Button
            </ActionButton>
            <ActionButton variant="secondary" onClick={handleSave}>
              Button
            </ActionButton>
            <ActionButton
              variant="primary"
              onClick={handleSave}
              iconLeft={<Plus />}
              iconRight={<Plus />}
            >
              Button
            </ActionButton>
            <ActionButton
              variant="secondary"
              onClick={handleSave}
              iconLeft={<Plus />}
              iconRight={<Plus />}
            >
              Button
            </ActionButton>
            <ActionButton
              variant="secondary"
              onClick={handleSave}
              iconLeft={<Plus />}
              iconRight={<Plus />}
              small
            >
              Button
            </ActionButton>
            <ActionButton
              variant="terniary"
              onClick={handleSave}
              small
              iconRight={<Plus />}
              iconLeft={<Plus />}
            >
              Button
            </ActionButton>
            <ActionButton
              variant="primary"
              onClick={handleSave}
              small
              iconRight={<Plus />}
              iconLeft={<Plus />}
            >
              Button
            </ActionButton>
            <ActionButton
              variant="secondary"
              onClick={handleSave}
              iconLeft={<Plus />}
              fullWidth
              small
            >
              Button
            </ActionButton>
            <ActionButton
              variant="terniary"
              onClick={handleSave}
              small
              fullWidth
              iconLeft={<Plus />}
            >
              Button
            </ActionButton>
            <ActionButton
              variant="primary"
              onClick={handleSave}
              small
              fullWidth
              iconLeft={<Plus />}
            >
              Button
            </ActionButton>
          </div>
        </div>
      </BaseModal>
      <ActionButton variant="primary" onClick={openModal}>
        Button Examples
      </ActionButton>
    </>
  );
}

export default ButtonExampleModal;

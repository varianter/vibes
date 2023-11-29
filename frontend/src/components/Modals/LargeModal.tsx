import React, { RefObject } from "react";
import BaseModal from "./BaseModal";
import { Check } from "react-feather";
import ActionButton from "../Buttons/ActionButton";
import { LargeModalHeader } from "./LargeModalHeader";
import { BookingType } from "@/types";

export interface EasyModalProps {
  children: React.ReactNode;
  onClose?: () => void;
  modalRef: RefObject<HTMLDialogElement>;
  showCloseButton?: true;
  engagementName: string;
  customerName: string;
  type: BookingType;
}

export function LargeModal(props: EasyModalProps) {
  const {
    children,
    onClose,
    modalRef,
    showCloseButton,
    engagementName,
    customerName,
    type,
  } = props;

  const dialogElement = modalRef?.current;

  function handleClose() {
    onClose?.();
    dialogElement?.close();
  }

  return (
    <BaseModal modalRef={modalRef} classNames="w-full max-w-screen-md">
      <LargeModalHeader
        engagementName={engagementName}
        customerName={customerName}
        type={type}
      />
      <div>{children}</div>
      <div className="w-full flex justify-end">
        {showCloseButton && (
          <ActionButton
            onClick={handleClose}
            variant={"primary"}
            iconLeft={<Check />}
            isIconBtn={true}
          >
            Ferdig
          </ActionButton>
        )}
      </div>
    </BaseModal>
  );
}

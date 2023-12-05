import React, { RefObject } from "react";
import BaseModal from "./BaseModal";
import { Check } from "react-feather";
import ActionButton from "../Buttons/ActionButton";
import { LargeModalHeader } from "./LargeModalHeader";
import { BookingType } from "@/api-types";

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
    <BaseModal modalRef={modalRef} classNames="h-[640px] max-w-[1200px]">
      <div className="flex flex-col h-full">
        <LargeModalHeader
          engagementName={engagementName}
          customerName={customerName}
          type={type}
        />
        <div className="flex-1">{children}</div>
        <div className="flex justify-end">
          {showCloseButton && (
            <ActionButton
              onClick={handleClose}
              variant={"primary"}
              iconLeft={<Check />}
              iconBtn
            >
              Ferdig
            </ActionButton>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
